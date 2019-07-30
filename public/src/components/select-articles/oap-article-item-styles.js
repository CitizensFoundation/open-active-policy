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

  .itemContent {
    position: relative;
    width: 300px;
    height: 70px;
    margin: 8px;
  }

  .name {
    max-width: 220px;
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

  .description {
    padding: 8px;
    font-size: 13px;
    margin-top: 42px;
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

  paper-button.addRemoveButton {
    position: absolute;
    bottom: 9px;
    right: 5px;
    font-size: 18px;
    width: 50px;
    min-width: 50px;
    background-color: var(--app-accent-color);
    color: var(--app-ballot-item-button-color, #fff);
  }

  paper-button.removeButton {
    background-color: #fff !important;
    color: var(--app-accent-color) !important;
  }

  paper-button.addFavoriteButton {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background-color: var(--app-ballot-item-button-back, #FFF);
    color: var(--app-ballot-item-button-color, var(--app-accent-color));
    --paper-button-iron-icon: {
      height: 29px;
      width: 29px;
    };
    padding: 0;
    padding-top: 1px;
  }

  paper-button.removeFavoriteButton {
    position: absolute;
    bottom: 12px;
    left: 12px;
    color: var(--app-ballot-item-remove-fav-button-color, rgb(255,215,0));
    background-color: var(--app-ballot-item-remove-fav-button-background-color, #FFF);
    --paper-button-iron-icon: {
      height: 29px;
      width: 29px;
    };
    padding: 0;
    padding-top: var(--app-ballot-item-remove-fav-padding-top, 1px);
  }

  paper-button[disabled] {
    background-color: #b7b7b7;
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

  google-map {
    z-index: 5;
  }

  paper-button {
    z-index: 5;
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

  #opacityLayer.cover {
    opacity: 1;
  }

  [hidden] {
    display: none !important;
  }
`;
