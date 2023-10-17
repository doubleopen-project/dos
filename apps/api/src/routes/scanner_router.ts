// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { PackageURL } from "packageurl-js";
import { scannerAPI } from "validation-helpers";
import * as s3Helpers from "s3-helpers";
import * as dbQueries from "../helpers/db_queries";
import * as dbOperations from "../helpers/db_operations";
import {
    authenticateORTToken,
    authenticateSAToken,
} from "../helpers/auth_helpers";
import { processPackageAndSendToScanner } from "../helpers/new_job_process";
import { stateMap } from "../helpers/state_helpers";

const scannerRouter = zodiosRouter(scannerAPI);

const jobStateMap: Map<string, string> = new Map();

// Get scan results for package with purl
scannerRouter.post("/scan-results", authenticateORTToken, async (req, res) => {
    try {
        console.log(
            "Searching for results for package with purl: " + req.body.purl,
        );

        const options = req.body.options || {};

        const response = await dbOperations.getPackageResults(
            req.body.purl,
            options,
        );
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Request presigned upload url for a file
scannerRouter.post("/upload-url", authenticateORTToken, async (req, res) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            throw new Error(
                "Error: SPACES_BUCKET environment variable is not defined",
            );
        }

        const objectExists = await s3Helpers.objectExistsCheck(
            req.body.key,
            process.env.SPACES_BUCKET,
        );

        if (objectExists === undefined) {
            console.log("Error: objectExists undefined");
            return res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message:
                    "Unable to determine if object with the requested key already exists",
            });
        }
        if (objectExists) {
            console.log(
                "Error: Object with key " + req.body.key + " already exists.",
            );
            return res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: "An object with the requested key already exists",
            });
        }

        const presignedUrl: string | undefined =
            await s3Helpers.getPresignedPutUrl(
                req.body.key,
                process.env.SPACES_BUCKET,
            );

        if (presignedUrl) {
            res.status(200).json({
                success: true,
                presignedUrl: presignedUrl,
                message: "Presigned URL received",
            });
        } else {
            console.log("Error: Presigned URL is undefined");
            res.status(200).json({
                success: false,
                presignedUrl: undefined,
                message: "Unable to get a presigned URL for the requested key",
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add new ScannerJob
scannerRouter.post("/job", authenticateORTToken, async (req, res) => {
    try {
        if (!process.env.SPACES_BUCKET) {
            throw new Error(
                "Error: SPACES_BUCKET environment variable is not defined",
            );
        }

        // Checking if the package exists
        let packageId = await dbQueries.findPackageIdByPurl(req.body.purl);

        if (!packageId) {
            const parsedPurl = PackageURL.fromString(req.body.purl);

            if (!parsedPurl.version) throw new Error("Check package url");

            let qualifiers = undefined;

            if (parsedPurl.qualifiers) {
                for (const [key, value] of Object.entries(
                    parsedPurl.qualifiers,
                )) {
                    if (qualifiers) {
                        qualifiers += "&" + key + "=" + value;
                    } else {
                        qualifiers = key + "=" + value;
                    }
                }
            }

            const jobPackage = await dbQueries.createPackage({
                type: parsedPurl.type,
                namespace: parsedPurl.namespace,
                name: parsedPurl.name,
                version: parsedPurl.version,
                qualifiers: qualifiers,
                subpath: parsedPurl.subpath,
                scanStatus: "pending",
            });

            if (jobPackage.purl !== req.body.purl) {
                dbQueries.deletePackage(jobPackage.id);
                throw new Error(
                    "Purl generated from the package data is invalid",
                );
            }

            packageId = jobPackage.id;
        }

        // Checking if there already is a ScannerJob for the package
        const existingJob =
            await dbQueries.findScannerJobIdStateByPackageId(packageId);

        if (
            existingJob &&
            existingJob.state !== "resultsDeleted" &&
            existingJob.state !== "failed"
        ) {
            // Deleting zip file from object storage
            await s3Helpers.deleteFile(
                process.env.SPACES_BUCKET,
                req.body.zipFileKey,
            );

            return res.status(200).json({
                scannerJobId: existingJob.id,
            });
        } else {
            await dbQueries.updatePackage({
                id: packageId,
                data: {
                    scanStatus: "pending",
                },
            });

            console.log("Adding a new ScannerJob to the database");

            const newScannerJob = await dbQueries.createScannerJob({
                data: {
                    state: "created",
                    packageId: packageId,
                },
            });

            processPackageAndSendToScanner(
                req.body.zipFileKey,
                newScannerJob.id,
                packageId,
                req.body.purl,
                jobStateMap,
            );

            return res.status(200).json({
                scannerJobId: newScannerJob.id,
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get ScannerJob state
scannerRouter.get("/job-state/:id", authenticateORTToken, async (req, res) => {
    try {
        const scannerJob = await dbQueries.findScannerJobStateById(
            req.params.id,
        );

        if (!scannerJob) {
            res.status(400).json({
                message:
                    "Bad Request: Scanner Job with requested id cannot be found in the database",
            });
        } else {
            let message = stateMap.get(scannerJob.state) || scannerJob.state;

            if (
                scannerJob.state === "processing" ||
                scannerJob.state === "savingResults"
            ) {
                message =
                    jobStateMap.get(scannerJob.id) ||
                    stateMap.get(scannerJob.state) ||
                    message;
            }
            res.status(200).json({
                state: {
                    status: scannerJob.state,
                    message: message,
                },
            });
        }
    } catch (error) {
        console.log("Problem with database query: " + error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ------------------------------------- SA ROUTES -------------------------------------

// Update ScannerJob state
scannerRouter.put("/job-state/:id", authenticateSAToken, async (req, res) => {
    try {
        if (req.body.state === "completed") {
            return res.status(400).json({
                message:
                    "Bad Request: Cannot change state to completed. Use /job-results endpoint instead",
            });
        } else {
            if (req.body.state === "active") {
                // Wait 5 ms
                // Reason: Scanner Agent might send requests for states 'waiting' and 'active' at the same time, and may be saved in the wrong order
                await new Promise((resolve) => setTimeout(resolve, 5));
            }

            const updatedScannerJob = await dbQueries.updateScannerJob(
                req.params.id as string,
                {
                    state: req.body.state,
                },
            );

            if (updatedScannerJob && req.body.state === "failed") {
                await dbQueries.updatePackage({
                    id: updatedScannerJob.packageId,
                    data: { scanStatus: "failed" },
                });
            }
            console.log(
                req.params.id + ': Changed state to "' + req.body.state + '"',
            );

            res.status(200).json({
                message:
                    "Received job with id " +
                    req.params.id +
                    ". Changed state to " +
                    req.body.state,
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Save job results to database
scannerRouter.post("/job-results", authenticateSAToken, async (req, res) => {
    try {
        dbOperations.saveJobResults(req.body.id, req.body.result, jobStateMap);
        res.status(200).json({
            message:
                "Received and saving results for job with with id " +
                req.body.id,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default scannerRouter;
