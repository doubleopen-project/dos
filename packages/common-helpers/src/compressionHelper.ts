// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { deflate, inflate } from "pako";

export function compress(json: string): Uint8Array {
    // Convert the JSON string to a Uint8Array using TextEncoder
    const textEncoder = new TextEncoder();
    const inputUint8Array = textEncoder.encode(json);

    // Compress the Uint8Array
    return deflate(inputUint8Array);
}

export function decompress(compressed: Uint8Array): string {
    // Decompress the Uint8Array
    const decompressedUint8Array = inflate(compressed);

    // Convert the Uint8Array back to a JSON string using TextDecoder
    const textDecoder = new TextDecoder();
    return textDecoder.decode(decompressedUint8Array);
}
