// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import TanstackProvider from "@/components/providers/TanstackProvider";
import Home from "@/pages/index";
import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

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
            name: /Welcome to DoubleOpen Front End/i,
        });

        expect(heading).toBeInTheDocument();
    });
});
