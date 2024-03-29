// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";
import TanstackProvider from "@/components/providers/TanstackProvider";
import Home from "@/pages/index";

jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("Home", () => {
    it("renders a heading", () => {
        mockRouter.push("/");

        render(
            <TanstackProvider>
                <Home />
            </TanstackProvider>,
        );

        const heading = screen.getByRole("heading", {
            name: /Welcome to Double Open Clearance UI/i,
        });

        expect(heading).toBeInTheDocument();
    });
});
