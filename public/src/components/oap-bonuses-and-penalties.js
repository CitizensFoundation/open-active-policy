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
    if (objectToAnalyse.sumBonusesByCulturalAttitute[attitute] &&
        objectToAnalyse.sumPenaltiesByCulturalAttitute[attitute]) {
          const profitLoss = objectToAnalyse.sumBonusesByCulturalAttitute[attitute]-objectToAnalyse.sumPenaltiesByCulturalAttitute[attitute];
          if (profitLoss<0) {
            verdict="highPenalty";
          } else {
           verdict="highBonus";
          }
          if (Math.abs(profitLoss)<=5) {
           verdict="breakEven";
          }
     } else {
       verdict="breakEven";
     }
     attitutesWinnersAndLosers[attitute]=verdict;
   });

   return attitutesWinnersAndLosers;
}

//highNetPenalties highNetBonuses breakEven

export const GetResultsForReview = (selectedItems, country, attituteReviews, countryReviews) => {
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

  debugger;

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
  if (Math.abs(totalProfitLoss)<=5) {
   verdict="breakEven";
  }

  if (country.reviews) {
    countryReviewParagraph=country.reviews[verdict];
  }

  debugger;

  return {attituteReviewParagraphs, countryReviewParagraph};
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
