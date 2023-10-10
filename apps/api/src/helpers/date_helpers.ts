// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

/*
This function is needed to reformat start_timestamp and end_timestamp strings 
from scancode result json so that a Date object can be created from it
*/
export const formatDateString = (datestring: string) => {
  return (
    datestring.slice(0, 13) +
    ":" +
    datestring.slice(13, 15) +
    ":" +
    datestring.slice(15)
  );
};
