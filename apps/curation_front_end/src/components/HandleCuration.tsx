// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as yaml from "js-yaml";
import ComboBox from "./ComboBox";

const fetchAndConvertYAML = async (): Promise<any> => {
  const response = await fetch(
    "https://raw.githubusercontent.com/doubleopen-project/policy-configuration/main/license-classifications.yml",
  );
  if (response.ok) {
    const yamlText = await response.text();
    const jsonData = yaml.load(yamlText) as { categorizations: { id: string }[] };
    const ids = jsonData.categorizations.map((item) => item.id);
    const sortedIds = ids.sort((a, b) => a.localeCompare(b));
    return sortedIds;
  } else {
    throw new Error(`Failed to fetch YAML file: ${response.status} ${response.statusText}`);
  }
};

const HandleCuration = () => {
  // Fetch the license classifications from Github
  const { data, isLoading, error } = useQuery({
    queryKey: ["license-classifications"],
    queryFn: fetchAndConvertYAML,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <ComboBox data={data} filterString={""} selectText="Select the curated license for this file..." />
  );
};

export default HandleCuration;
