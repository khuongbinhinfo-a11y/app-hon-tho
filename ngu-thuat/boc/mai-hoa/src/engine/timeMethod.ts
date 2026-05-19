import type { TimeInput, CalculationResult, DerivationStep } from "./types";
import { mod1 } from "./mod";
import { getTrigramByMHNum } from "./trigram";
import { getHexagramByTrigrams, calculateMutualHexagram, calculateChangedHexagram } from "./hexagram";
import earthlyBranches from "../data/earthly_branches.json";

export function calculateByTime(input: TimeInput): CalculationResult {
  const { yearBranch, month, day, hourBranch } = input;
  
  const warnings: string[] = [];
  const derivationSteps: DerivationStep[] = [];
  
  // Validate input
  if (yearBranch < 1 || yearBranch > 12) {
    warnings.push("Chi năm phải từ 1-12");
  }
  if (month < 1 || month > 12) {
    warnings.push("Tháng phải từ 1-12");
  }
  if (day < 1 || day > 30) {
    warnings.push("Ngày phải từ 1-30");
  }
  if (hourBranch < 1 || hourBranch > 12) {
    warnings.push("Chi giờ phải từ 1-12");
  }
  
  const yearBranchName = earthlyBranches.find(b => b.id === yearBranch)?.name || "";
  const hourBranchName = earthlyBranches.find(b => b.id === hourBranch)?.name || "";
  
  // Calculate upper trigram (thượng quái)
  // upper = (năm + tháng + ngày) % 8
  const upperRaw = yearBranch + month + day;
  const upperIndex = mod1(upperRaw, 8);
  derivationSteps.push({
    step: "Tính Thượng quái",
    formula: "(năm chi + tháng + ngày) mod 8, nếu chia hết lấy 8",
    calculation: `(${yearBranch} + ${month} + ${day}) mod 8 = ${upperRaw} mod 8`,
    result: upperIndex
  });
  
  // Calculate lower trigram (hạ quái)
  // lower = (năm + tháng + ngày + giờ) % 8
  const lowerRaw = yearBranch + month + day + hourBranch;
  const lowerIndex = mod1(lowerRaw, 8);
  derivationSteps.push({
    step: "Tính Hạ quái",
    formula: "(năm chi + tháng + ngày + giờ chi) mod 8, nếu chia hết lấy 8",
    calculation: `(${yearBranch} + ${month} + ${day} + ${hourBranch}) mod 8 = ${lowerRaw} mod 8`,
    result: lowerIndex
  });
  
  // Calculate moving line (hào động)
  // moving = (năm + tháng + ngày + giờ) % 6
  const movingRaw = yearBranch + month + day + hourBranch;
  const movingLine = mod1(movingRaw, 6);
  derivationSteps.push({
    step: "Tính Hào động",
    formula: "(năm chi + tháng + ngày + giờ chi) mod 6, nếu chia hết lấy 6",
    calculation: `(${yearBranch} + ${month} + ${day} + ${hourBranch}) mod 6 = ${movingRaw} mod 6`,
    result: movingLine
  });
  
  // Get trigrams and hexagrams
  const upperTrigram = getTrigramByMHNum(upperIndex)!;
  const lowerTrigram = getTrigramByMHNum(lowerIndex)!;
  
  const primaryHexagram = getHexagramByTrigrams(upperTrigram.id, lowerTrigram.id)!;
  const mutualHexagram = calculateMutualHexagram(primaryHexagram, movingLine)!;
  const changedHexagram = calculateChangedHexagram(primaryHexagram, movingLine)!;
  
  derivationSteps.push({
    step: "Xác định Quẻ chủ",
    formula: "Thượng quái + Hạ quái",
    calculation: `${upperTrigram.name_vi} trên ${lowerTrigram.name_vi} = ${primaryHexagram.name_vi}`,
    result: primaryHexagram.kw_index
  });
  
  derivationSteps.push({
    step: "Xác định Quẻ hỗ",
    formula: "Hào 2,3,4 làm hạ quái, hào 3,4,5 làm thượng quái",
    calculation: "",
    result: mutualHexagram.kw_index
  });
  
  derivationSteps.push({
    step: "Xác định Quẻ biến",
    formula: "Đảo hào động",
    calculation: `Hào ${movingLine} đổi`,
    result: changedHexagram.kw_index
  });
  
  return {
    methodType: "time",
    rulesetId: "mhds_time_v1",
    rawInput: input,
    normalizedInput: {
      yearBranch: `${yearBranch} (${yearBranchName})`,
      month,
      day,
      hourBranch: `${hourBranch} (${hourBranchName})`
    },
    derivationSteps,
    upperTrigram,
    lowerTrigram,
    movingLine,
    primaryHexagram,
    mutualHexagram,
    changedHexagram,
    warnings
  };
}
