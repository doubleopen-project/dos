// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

// ------------------------- Database schemas -------------------------

// ---------------------------- ScannerJob ----------------------------

export const DBScannerJobSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  state: z.string(),
  scannerName: z.string().optional().nullable(),
  scannerVersion: z.string().optional().nullable(),
  scannerConfig: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  scanStartTS: z.coerce.date().optional().nullable(),
  scanEndTS: z.coerce.date().optional().nullable(),
  spdxLicenseListVersion: z.string().optional().nullable(),
  packageId: z.number(),
});

export type DBScannerJobType = z.infer<typeof CreateScannerJobSchema>;

const CreateScannerJobSchema = z.object({
  data: z.object({
    state: z.string(),
    packageId: z.number(),
  }),
});

export type CreateScannerJobInput = z.infer<typeof CreateScannerJobSchema>;

const UpdateScannerJobSchema = z.object({
  id: z.string({
    required_error: "Id is required",
  }),
  data: z.object({
    state: z.string().optional(),
    scannerName: z.string().optional(),
    scannerVersion: z.string().optional(),
    scannerConfig: z.string().optional(),
    duration: z.number().optional(),
    scanStartTS: z.date().optional(),
    scanEndTS: z.date().optional(),
    spdxLicenseListVersion: z.string().optional(),
  }),
});

export type UpdateScannerJobInput = z.infer<typeof UpdateScannerJobSchema>;

const ScannerJobOnlyIdSchema = z.object({
  id: z.string(),
});

export type ScannerJobOnlyIdOutput = z.infer<typeof ScannerJobOnlyIdSchema>;

// ------------------------------- File -------------------------------

export const DBFileSchema = z.object({
  id: z.number(),
  sha256: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  scanStatus: z.string(),
});

const CreateFileSchema = z.object({
  data: z.object({
    sha256: z.string(),
    scanStatus: z.string(),
  }),
});

export type CreateFileInput = z.infer<typeof CreateFileSchema>;

const UpdateFileSchema = z.object({
  id: z.number({
    required_error: "Id is required",
  }),
  data: z.object({
    scanStatus: z.string().optional(),
  }),
});

export type UpdateFileInput = z.infer<typeof UpdateFileSchema>;

// -------------------------- LicenseFinding --------------------------

const CreateLicenseFindingSchema = z.object({
  data: z.object({
    scanner: z.string(),
    scannerConfig: z.string(),
    licenseExpressionSPDX: z.string(),
    fileSha256: z.string(),
  }),
});

export type CreateLicenseFindingInput = z.infer<
  typeof CreateLicenseFindingSchema
>;

// -------------------------- LicenseFindingMatch --------------------------

const CreateLicenseFindingMatchSchema = z.object({
  data: z.object({
    startLine: z.number(),
    endLine: z.number(),
    score: z.number(),
    licenseExpression: z.string(),
    licenseFindingId: z.number(),
  }),
});

export type CreateLicenseFindingMatchInput = z.infer<
  typeof CreateLicenseFindingMatchSchema
>;

// -------------------------- LicenseConclusion --------------------------

const CreateLicenseConclusionSchema = z.object({
  data: z.object({
    concludedLicenseExpressionSPDX: z.string(),
    detectedLicenseExpressionSPDX: z.string(),
    comment: z.string(),
    contextPurl: z.string(),
    fileSha256: z.string(),
    userId: z.number(),
  }),
});

export type CreateLicenseConclusionInput = z.infer<
  typeof CreateLicenseConclusionSchema
>;

// ------------------------- CopyrightFinding -------------------------

const CreateCopyrightFindingSchema = z.object({
  data: z.object({
    startLine: z.number(),
    endLine: z.number(),
    copyright: z.string(),
    scanner: z.string(),
    scannerConfig: z.string(),
    fileSha256: z.string(),
  }),
});

export type CreateCopyrightFindingInput = z.infer<
  typeof CreateCopyrightFindingSchema
>;

// ---------------------------- ScanIssue ----------------------------
const CreateScanIssueSchema = z.object({
  data: z.object({
    severity: z.string(),
    message: z.string(),
    scanner: z.string(),
    scannerConfig: z.string(),
    fileSha256: z.string(),
  }),
});

export type CreateScanIssueInput = z.infer<typeof CreateScanIssueSchema>;

// ----------------------------- Package -----------------------------

const CreatePackageSchema = z.object({
  data: z.object({
    purl: z.string(),
    name: z.string(),
    version: z.string(),
    scanStatus: z.string(),
  }),
});

export type CreatePackageInput = z.infer<typeof CreatePackageSchema>;

const UpdatePackageSchema = z.object({
  id: z.number({
    required_error: "Id is required",
  }),
  data: z.object({
    scanStatus: z.string().optional(),
  }),
});

export type UpdatePackageInput = z.infer<typeof UpdatePackageSchema>;

// ----------------------------- FileTree -----------------------------

const CreateFileTreeSchema = z.object({
  data: z.object({
    path: z.string(),
    packageId: z.number(),
    fileSha256: z.string(),
  }),
});

export type CreateFileTreeInput = z.infer<typeof CreateFileTreeSchema>;
