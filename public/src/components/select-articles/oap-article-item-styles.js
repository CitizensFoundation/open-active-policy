/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapArticleItemStyles = css`

  .leftColor {
    width: 4px;
    max-width: 4px;
    margin: 0;
    padding: 0;
  }

  #closeButton {
    position: absolute;
    right: 2px;
    bottom: -32px;
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    margin-bottom: 4px;
    cursor: pointer;
    color: #FFF;
  }

  .itemContent {
    position: relative;
    width: 300px;
    height: 70px;
    margin: 8px;
  }

  .name {
    max-width: 220px;
    cursor: pointer;
  }

  .name[exclusive-active]:not([only-display]) {
    position: absolute;
    font-size: 14px;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  .name[module-type] {
    position: absolute;
    font-size: 22px;
    top: 50%;
    transform: translateY(-50%);
    color: #FFF;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .itemContent[small] {
    width: 260px !important;
    height: 277px;
    margin: 0;
  }

  .itemContent[small][tiny] {
    width: 220px !important;
    height: 220px;
  }

  .itemSelectedFrame {
    background: transparent;
    border: none;
    width: 296px;
    height: 316px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }

  .itemSelectedFrame[small] {
    width: 254px;
    height: 271px;
  }

  .itemSelectedFrame[tiny] {
    width: 214px;
    height: 214px;
  }

  .buttons {
    z-index: 5;
  }

  .itemSelectedFrame[selected] {
    background: transparent;
    border: solid 2px;
    border-color: var(--app-accent-color);
  }

  iron-image {
    width: 300px;
    height: 201px;
  }

  iron-image[small] {
    width: 260px;
    height: 175px;
  }

  iron-image[small][tiny] {
    width: 220px;
    height: 148px;
  }

  .descriptionContainer {
    height: 100%;
    width: 300px;
    margin: 0;
    overflow: hidden;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    background-color: var(--app-ballot-item-description-background-color, #333);
    color: var(--app-ballot-item-description-color, #FFF);
    margin-bottom: 7px;
  }

  .descriptionContainer[small] {
    width: 260px;
    height: 146px;
    font-size: 12px;
    text-align: left;
  }

  .descriptionContainer[small][tiny] {
    width: 220px;
    height: 124px;
    font-size: 11px;
  }

  .name {
    font-size: var(--app-item-name-font-size, 14px);
    padding: 8px;
    color: var(--app-ballot-item-name-color, #000);
  }

  .name[small] {
    font-size: var(--app-item-name-font-size-small, 13px);
    padding-top: 4px;
    padding-right: 4px;
    padding-top: 4px;
  }

  .name[small][tiny] {
    font-size: 14px;
  }

  .price {
    font-size: 25px;
    position: absolute;
    bottom: 8px;
    left: 92px;
    color: var(--app-accent-color);
  }

  .price[no-millions] {
    left: 108px;
  }

  .price[small] {
    left: 70px;
  }

  .price[no-millions][small] {
    left: 95px;
  }

  .price[small][tiny] {
    left: 42px;
  }

  .priceCurrency {
    font-size: 23px;
    color: var(--app-accent-color);
  }

  .name[inbudget] {
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    max-width: 100%;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 16px;
  }

  .name[only-display] {
    margin-top: 8px;
    padding-bottom: 0px;
    margin-left: 6px;
    margin-right: 16px;
    max-width: 280px;
  }

  .description {
    padding: 8px;
    font-size: 13px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .description[only-display] {
    padding-bottom: 24px;
  }

  .name[only-display] {
    padding-top: 8px;
    padding-bottom: 8px;
  }


  .cardImage {
    width: 300px;
    height: 201px;
  }

  .itemContent[inbudget] {
    position: relative;
    height: 100%;
  }

  .name[in-budget-selection]:not([exclusive-active]):not([module-type]) {
    text-decoration: underline;
  }


  .subCategory {
    position: absolute;
    bottom: 4px;
    left: 8px;
    color: #656565;
    font-size: 12px;
  }

  #addToBudgetButton[exclusive-active] {
    -webkit-transition: transform 1400ms ease;
    -o-transition: transform 1400ms ease;
    transition: transform 1400ms ease;
    -webkit-transform: scale(0.1);
    -o-transform: scale(0.1);
    transform: scale(0.1);
  }

  #addToBudgetButton[exclusive-selected] {
    -webkit-transform: scale(1.0);
    -o-transform: scale(1.0);
    transform: scale(1.0);
  }

  #topContainer {
    /*cursor: pointer;*/
    border-radius: 5px;
  }

  #topContainer[only-display] {
    /*cursor: pointer;*/
    border-radius: 0;
  }
  .addRemoveButton {
    position: absolute;
    bottom: 11px;
    right: 5px;
    font-size: 18px;
    margin: 0;
    width: 36px;
    height: 32px;
    margin-right: 6px;
    border-radius: 3px;
    padding: 8px;
    text-align: center;
    cursor: pointer;
    background-color: var(--app-accent-color);
    color: var(--app-ballot-item-button-color, #fff);
  }

  .exclusiveName {
    position: absolute;
    top: 24px;
    left: 8px;
    font-size: 14px;
    font-weight: 500;
    max-width: 218px;
  }

  .editExclusiveMenuButton {
    position: absolute;
    bottom: 2px;
    right: 5px;
    text-align: center;
  }

  .editExclusiveButton {
    font-size: 18px;
    margin: 0;
    width: 50px;
    height: 50px;
    border-radius: 3px;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    background-color: var(--app-accent-color);
    color: var(--app-ballot-item-button-color, #fff);
  }

  .priceText {
    margin-top: 6px;
  }

  .addRemoveButton[disabled] {
    cursor: default;
    background-color: #b7b7b7;
  }

  #isBlockedByInfo {
    position: absolute;
    /*
    top: 50%;
    transform: translateY(-50%);
    */
    bottom: 6px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 16px;
    margin-left: 8px;
    margin-right: 8px;
  }

  .removeButton {
    background-color: #fff !important;
    color: var(--app-accent-color) !important;
    position: static;
    margin-bottom: 12px;
    margin-left: auto;
    margin-right: auto;

  }

  .shareIcon {
    position: absolute;
    bottom: 6px;
    left: 0;
    --paper-share-button-icon-color: var(--app-accent-color-light);
    --paper-share-button-icon-height: 46px;
    --paper-share-button-icon-width: 46px;
    -webkit-filter: drop-shadow( 1px 1px 10px #555 );
    filter: drop-shadow( 1px 1px 10px #555 );
  }

  .shareIcon[small] {
    display: none;
  }

  .budgetContainer {
  }

  .itemContent {
    color: var(--app-ballot-item-content-color, #222);
    background-color: var(--app-ballot-item-content-background-color, #fbfbfb);
  }

  .addRemoveButton {

  }

  .infoIcon {
    color: var(--app-accent-color-light);
    width: 32px;
    height: 32px;
    padding: 0;
    margin-right: 4px;
  }

  .infoLinks {
    position: absolute;
    top: 118px;
    right: 0px;
    z-index: 2;
  }

  .stateDropdown {
    color: var(--app-accent-color-light);
    position: absolute;
    top: 60px;
    right: 0;
    z-index: 2;
    padding-right: 0;
    margin-right: 0;
  }

  .dropdownMenuButton {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .dropdownButton {
    background-color: var(--app-accent-color);
    opacity: 0.8;
    color: var(--app-ballot-item-button-color, #fff);
    padding: 2px;
    width: 32px;
    height: 26px;
  }

  .infoLinks[small] {
    top: 98px;
  }

  .infoLinks[small][tiny] {
    top: 78px;
  }

  .externalInfoIcon {
    color: var(--app-ballot-item-extinfo-icon-color, #999);
    width: 45px;
    height: 45px;
  }

  .externalIconContainer {
    position: absolute;
    bottom: 4px;
    left: 0px;
    z-index: 2;
  }

  .favoriteButtons {
  }

  .cost {
    padding-left: 8px;
    position: relative;
    bottom: 12px;
    font-weight: bold;
    font-size: 20px;
    left: 120px;
    color: var(--app-accent-color, #F00);
  }

  #opacityLayer {
    display: none;
    position: absolute;
    background-color: #FF1744;
    top: 0;
    right: 0;
    width: 300px;
    height: 70px;
    z-index: 2000;
  }

  #opacityLayer {
    width: 100%;
  }

  @media (max-width: 600px) {

  .itemContent[only-display] {
    margin-left: auto;
    margin-right: auto;
  }

  [hidden] {
    display: none !important;
  }
`;
