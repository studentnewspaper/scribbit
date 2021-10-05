import { useRef } from "react";
import Validator from "../worker/worker?worker";
import type { AnalyserApi } from "../worker/worker";
import { Remote, wrap } from "comlink";

export function useValidator() {
  const validatorRef = useRef<Remote<AnalyserApi>>();

  if (validatorRef.current == null) {
    console.log(`Creating worker...`);
    const validator = new Validator();

    validator.onerror = (err) => {
      throw err;
    };

    validatorRef.current = wrap(validator);
  }

  return validatorRef.current;
}
