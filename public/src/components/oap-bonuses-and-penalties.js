'use strict';

const runningBonusPenaltyInfo = {
  allBonuses: [],
  allBonusesByCulturalAttitute: {},
  sumBonusesByCulturalAttitute: {},
  allBonusesByLevel: {},
  allPenalties: [],
  allPenaltiesByCulturalAttitute: {},
  sumPenaltiesByCulturalAttitute: {},
  allPenaltiesByLevel: {},
  totalBonuses: 0,
  totalPenalties: 0,
  totalBonusesCount: 0,
  totalPenaltiesCount: 0
}

const saveItemForReview = (item, bonusesAndPenalties, bonuses, penalties) => {
  bonusesAndPenalties.push(item);
  if (item.type=="bonus") {
    bonuses.push(item);
  } else {
    penalties.push(item);
  }
}

const saveItemToObject = (targetObject, item) => {
  if (item.type=="bonus") {
    targetObject.totalBonusesCount+=1;
    targetObject.totalBonuses+=item.value;
    targetObject.allBonuses.push(item);
    if (!targetObject.allBonusesByCulturalAttitute[item.attitute]) {
      targetObject.allBonusesByCulturalAttitute[item.attitute] = [];
    }
    if (!targetObject.sumBonusesByCulturalAttitute[item.attitute]) {
      targetObject.sumBonusesByCulturalAttitute[item.attitute] = 0;
    }
    targetObject.allBonusesByCulturalAttitute[item.attitute].push(item);
    targetObject.sumBonusesByCulturalAttitute[item.attitute]+=item.value;

    if (!targetObject.allBonusesByLevel[item.level]) {
      targetObject.allBonusesByLevel[item.level] = [];
    }
    targetObject.allBonusesByLevel[item.level].push(item);
  } else {
    targetObject.totalPenaltiesCount+=1;
    targetObject.totalPenalties+=item.value;
    targetObject.allPenalties.push(item);
    if (!targetObject.allPenaltiesByCulturalAttitute[item.attitute]) {
      targetObject.allPenaltiesByCulturalAttitute[item.attitute] = [];
    }
    if (!targetObject.sumPenaltiesByCulturalAttitute[item.attitute]) {
      targetObject.sumPenaltiesByCulturalAttitute[item.attitute] = [];
    }
    targetObject.allPenaltiesByCulturalAttitute[item.attitute].push(item);
    targetObject.sumPenaltiesByCulturalAttitute[item.attitute]+=item.value;

    if (!targetObject.allPenaltiesByLevel[item.level]) {
      targetObject.allPenaltiesByLevel[item.level] = [];
    }
    targetObject.allPenaltiesByLevel[item.level].push(item);
  }
}

const attitutes = ["lawAndOrder","progressivism","authority","science",
"collective","privacy","liberty","tradition","independence"];

const analyseBonusPenaltiesForAttitutes = (objectToAnalyse) => {
  const attitutesWinnersAndLosers = {};

  attitutes.forEach((attitute)=>{
    let verdict;
    let profitLoss = 0;
    const bonuses = objectToAnalyse.sumBonusesByCulturalAttitute[attitute] ? objectToAnalyse.sumBonusesByCulturalAttitute[attitute] : 0;
    const penalties = objectToAnalyse.sumPenaltiesByCulturalAttitute[attitute] ? objectToAnalyse.sumPenaltiesByCulturalAttitute[attitute] : 0;
    if (bonuses || penalties) {
      profitLoss = bonuses-penalties;
      if (profitLoss<0) {
        verdict="highPenalty";
      } else {
        verdict="highBonus";
      }
      if (Math.abs(profitLoss)<=12) {
        verdict="breakEven";
      }
     } else {
       verdict="breakEven";
    }
    attitutesWinnersAndLosers[attitute]=verdict;
    console.info("Bonus/Penalty test: "+attitute+" - bonuses:"+bonuses);
    console.info("Bonus/Penalty test: "+attitute+" - penalties:"+penalties);
    console.info("Bonus/Penalty test: "+attitute+" - profitLoss:"+profitLoss);
    console.info("Bonus/Penalty test: "+attitute+": "+verdict);
  });

  return attitutesWinnersAndLosers;
}

export const GetCompletionScoreByModuleType = (allItems, selectedItems) => {
  const moduleTypesAuthorship = {};
  let totalAuthorship = 0;
  let countedAuthorship = 0;

  allItems.forEach((item)=>{
    if (item.module_type=="ModuleTypeCard") {
      moduleTypesAuthorship[item.module_type_index]={ name: item.name, status: "weak", totalCount: 0, counted: 0, completedPercent: 0};
    } else {
      if (item.authorshipPercent) {
        moduleTypesAuthorship[item.module_type_index].totalCount+=parseInt(item.authorshipPercent);
        totalAuthorship+=parseInt(item.authorshipPercent);
      }
    }
  });

  selectedItems.forEach((item)=>{
    if (item.authorshipPercent) {
      moduleTypesAuthorship[item.module_type_index].counted+=parseInt(item.authorshipPercent);
      moduleTypesAuthorship[item.module_type_index].completedPercent = moduleTypesAuthorship[item.module_type_index].counted / moduleTypesAuthorship[item.module_type_index].totalCount;
      if (moduleTypesAuthorship[item.module_type_index].counted>=20) {
        moduleTypesAuthorship[item.module_type_index].status = "viable";
      }
      countedAuthorship+=parseInt(item.authorshipPercent);
    }
  });

  return moduleTypesAuthorship;
}

export const GetResultsForReview = (selectedItems, allItems, country, attituteReviews, countryReviews) => {
  const attituteReviewParagraphs = {};
  let countryReviewParagraph;

  const bonusPenaltyInfo = {
    allBonuses: [],
    allBonusesByCulturalAttitute: {},
    sumBonusesByCulturalAttitute: {},
    allBonusesByLevel: {},
    allPenalties: [],
    allPenaltiesByCulturalAttitute: {},
    sumPenaltiesByCulturalAttitute: {},
    allPenaltiesByLevel: {},
    totalBonuses: 0,
    totalPenalties: 0,
    totalBonusesCount: 0,
    totalPenaltiesCount: 0
  }

  selectedItems.forEach((item)=>{
    const bonusesAndPenalties = GetBonusesAndPenaltiesForItem(item, country).bonusesAndPenalties;
    bonusesAndPenalties.forEach((innerItem) => {
      saveItemToObject(bonusPenaltyInfo, innerItem);
    });
  });

  console.log("bonusPenaltyInfo");
  console.log(bonusPenaltyInfo);
  console.log("runningBonusPenaltyInfo");
  console.log(runningBonusPenaltyInfo);

  const attitutesWinnersAndLosers = analyseBonusPenaltiesForAttitutes(bonusPenaltyInfo);

  attitutes.forEach((attitute)=>{
    let countryLevel;
    if (country.culturalAttitutes[attitute]>6) {
      countryLevel="high";
    } else if (country.culturalAttitutes[attitute]>2) {
      countryLevel="medium";
    } else {
      countryLevel="low";
    }
    attituteReviewParagraphs[attitute]=attituteReviews[attitute][attitutesWinnersAndLosers[attitute]][countryLevel];
  });

  const totalProfitLoss = bonusPenaltyInfo.totalBonuses-bonusPenaltyInfo.totalPenalties;
  let verdict;
  if (totalProfitLoss<0) {
    verdict="highNetPenalties";
  } else {
   verdict="highNetBonuses";
  }
  if (Math.abs(totalProfitLoss)<=15) {
   verdict="breakEven";
  }

  const completionScore = GetCompletionScoreByModuleType(allItems, selectedItems);

  let isConstitutionViable = true;
  Object.keys(completionScore).forEach((objectKey) => {
    if (completionScore[objectKey].status=="weak") {
      isConstitutionViable = false;
    }
  });

  if (!isConstitutionViable) {
    verdict="highNetPenalties";
  }

  console.info("Total bonsues: "+bonusPenaltyInfo.totalBonuses);
  console.info("Total penalties: "+bonusPenaltyInfo.totalPenalties);
  console.info("Total verdict: "+verdict);

  if (country.reviews) {
    countryReviewParagraph=country.reviews[verdict];
  }

  return { attituteReviewParagraphs, countryReviewParagraph, completionScore, isConstitutionViable };
}

export const GetBonusesAndPenaltiesForItem = (item, country) => {
    let bonusesAndPenalties = [];
    let bonuses = [];
    let penalties = [];
    let bonusCount = 0;
    let penaltyCount = 0;

    let bonusesRules = item.bonus ? item.bonus.split(",") : [];
    bonusesRules = bonusesRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","progressivism");
    });

    let penaltyRules =  item.penalty ? item.penalty.split(",") : [];
    penaltyRules = penaltyRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","progressivism");
    });

    bonusesRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
      } else if (level==="high") {
        if (country.culturalAttitutes[attitute]>=7) {
          const itemToSave = {id: item.id, type:"bonus", value: 7, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          bonusCount+=1;
        }
      } else if (level==="medium") {
        if (country.culturalAttitutes[attitute]>=3 && country.culturalAttitutes[attitute]<7) {
          const itemToSave = {id: item.id, type:"bonus", value: 5, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          bonusCount+=1;
        }
      } else if (level==="low") {
        if (country.culturalAttitutes[attitute]>=0 && country.culturalAttitutes[attitute]<3) {
          const itemToSave = {id: item.id, type:"bonus", value: 2, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          bonusCount+=1;
        }
      }
    });

    penaltyRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
        console.error("Wrong level");
      } else if (level==="high") {
        if (country.culturalAttitutes[attitute]>=7) {
          const itemToSave = {id: item.id, type:"penalty", value: 7, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          penaltyCount+=1;
        }
      } else if (level==="medium") {
        if (country.culturalAttitutes[attitute]>=3 && country.culturalAttitutes[attitute]<7) {
          const itemToSave = {id: item.id, type:"penalty", value: 5, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          penaltyCount+=1;
        }
      } else if (level==="low") {
        if (country.culturalAttitutes[attitute]>=0 && country.culturalAttitutes[attitute]<3) {
          const itemToSave = {id: item.id, type:"penalty", value: 2, attitute: attitute, level: level};
          saveItemForReview(itemToSave, bonusesAndPenalties, bonuses, penalties);
          penaltyCount+=1;
        }
      }
    });

    return { bonusesAndPenalties, bonusCount, penaltyCount, bonuses, penalties };
}


export const GetEmojiFromAttitute = (attitute) => {
  const emojis = {
        authority: "🏛️",
        liberty: "🌅",
        science: "🔬",
        tradition: "🏺",
        collective: "👥",
        independence: "🛡️",
        privacy: "🔐",
        lawAndOrder: "👮",
        progressivism: "✊",
        naturalResourceWealth: "🔋",
        borderDensity: "🛂",
        hostilityNeighboringCountries: "🌐",
        barrieresToCitizenship: "🧱"
  }
  return emojis[attitute];
}
