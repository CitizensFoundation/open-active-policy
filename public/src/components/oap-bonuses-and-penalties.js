'use strict';

export const GetBonusesAndPenaltiesForItem = (item, country) => {
    let bonusesAndPenalties = [];
    let bonusCount = 0;
    let penaltyCount = 0;

    let bonusesRules = item.bonus ? item.bonus.split(",") : [];
    bonusesRules = bonusesRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","socialProgress");
    });

    let penaltyRules =  item.penalty ? item.penalty.split(",") : [];
    penaltyRules = penaltyRules.map((rule) => {
      return rule = rule.toLowerCase().replace("law/order","lawAndOrder").replace("law and order","lawAndOrder").replace("social progress","socialProgress");
    });


    bonusesRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
      } else if (level==="high") {
        if (country.culturalAttitutes[attitute]>=7) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 7, attitute: attitute, level: level});
          bonusCount+=1;
        }
      } else if (level==="medium") {
        if (country.culturalAttitutes[attitute]>=3 && country.culturalAttitutes[attitute]<7) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 5, attitute: attitute, level: level});
          bonusCount+=1;
        }
      } else if (level==="low") {
        if (country.culturalAttitutes[attitute]>=0 && country.culturalAttitutes[attitute]<3) {
          bonusesAndPenalties.push({id: item.id, type:"bonus", value: 2, attitute: attitute, level: level});
          bonusCount+=1;
        }
      }
    });

    penaltyRules.forEach((bonus) => {
      const splitBonus = bonus.split(" ");
      const level = splitBonus[0];
      const attitute = splitBonus[1];
      if (level==="bonus") {
      } else if (level==="high") {
        if (country.culturalAttitutes[attitute]>=7) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 7, attitute: attitute, level: level});
          penaltyCount+=1;
        }
      } else if (level==="medium") {
        if (country.culturalAttitutes[attitute]>=3 && country.culturalAttitutes[attitute]<7) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 5, attitute: attitute, level: level});
          penaltyCount+=1;
        }
      } else if (level==="low") {
        if (country.culturalAttitutes[attitute]>=0 && country.culturalAttitutes[attitute]<3) {
          bonusesAndPenalties.push({id: item.id, type:"penalty", value: 1, attitute: attitute, level: level});
          penaltyCount+=1;
        }
      }
    });

    return { bonusesAndPenalties, bonusCount, penaltyCount };
}

