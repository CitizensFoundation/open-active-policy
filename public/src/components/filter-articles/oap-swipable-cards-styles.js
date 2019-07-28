/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const OapSwipableCardsStyles = css`
  /*------ CSS Use Case Example START ------*/

  body {
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      margin: 0 15px;
  }

  .background-0 { background: #C87D26; }
  .background-1 { background: #569D99; }
  .background-2 { background: #740039; }
  .background-3 { background: #839FC5; }
  .background-4 { background: #6A4F76; }
  .background-5 { background: #57636D; }
  .background-6 { background: #6D5242; }
  .background-7 { background: #4F5051; }

  .background-0,
  .background-1,
  .background-2,
  .background-3,
  .background-4,
  .background-5,
  .background-6,
  .background-7 {
    transition: all 400ms ease;
  }

  :host {
  }

  .topestContainer {
    overflow: -moz-scrollbars-none;
    width: 100%;
  }
  /* class created only for a better preview*/
  .stage {
      position: absolute;
      opacity: 1;
      max-width: 335px;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
  }

  .stage.hidden {
    opacity: 0;
    transition: all 400ms ease;
  }

  @media screen and (max-width: 600px) {
      .stage {
          max-width: 100%;
        }
    }

  h1, h2, h3 {
    margin: 0;
  }

  h1 {
    font-size: 32px;
    font-weight: 400;
  }

  h2 {
    font-size: 24px;
    font-weight: 100;
    color: #FFF;
    text-align: center;
  }

  h3 {
    font-size: 18px;
    font-weight: 300;
    color: #BFBFBE;
    margin-top: 10px;
  }

  .title {
      width: 100%;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 16px;
      color: #eee !important;
  }

  .card-content {
    position: relative;
    color: #fff;
    padding: 5px;
  }

  .card-image {
    width: 100%;
    height: 100%;
  }
  .card-image img {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    -o-object-fit: cover;
        object-fit: cover;
    width: 100%;
    height: 100%;
    min-height: 330px;
  }

  .card-titles {
    position: absolute;
    bottom: 0;
    padding: 40px 30px;
  }

  .card-footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    padding: 25px 35px;
  }

  .popular-destinations-text {
    font-size: 16px;
    font-weight: 400;
    color: #8E9AA4;
    width: 100%;
    min-width: 110px;
  }

  .popular-destinations-images {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
          -ms-flex-pack: end;
              justify-content: flex-end;
      width: 100%;
  }

  .circle {
      width: 40px;
      height: 40px;
      border-radius:  50%;
      background: #fff;
      margin-left: 8px;
  }

  .circle img {
      border-radius: 50%
  }

  /* global actions buttons*/
  .global-actions {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      -webkit-box-pack: center;
          -ms-flex-pack: center;
              justify-content: center;
      padding-top: 24px;
      min-width: 200px;
  }

  .top-action,
  .right-action,
  .left-action {
      border-radius: 50%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
      -webkit-box-pack: center;
          -ms-flex-pack: center;
              justify-content: center;
      background: #fff;
    -webkit-box-shadow: 0 3px 4px 0px rgba(0,0,0,0.5);
            box-shadow: 0 3px 4px 0px rgba(0,0,0,0.5);
  }
  .right-action,
  .left-action {
      width: 60px;
      height: 60px;
  }

  .top-action {
      width: 40px;
      height: 40px;
      margin: 0 20px;
  }

  .final-state.active {
    position: absolute;
    opacity: 1;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: all 400ms ease;
  }

  .final-state.hidden {
    opacity: 0;
  }


  /*------ CSS Use Case Example END ------*/

  /*----- Stacked Cards component css START -----*/
  body {
      overflow-x: hidden;
  }

  .no-transition {
    -webkit-transition: none ! important;
    transition: none ! important;
  }

  .stackedcards-overflow {
      overflow-y: hidden !important;
  }

  .stackedcards.init {
      opacity: 0;/* set the opacity to 0 if you want a fade-in effect to stacked cards on page load */
  }

  .stackedcards {
      position: relative;
  }

  .stackedcards * {
      -webkit-user-select: none;
              -moz-user-select: none;
                -ms-user-select: none;
            user-select: none;
  }

  .stackedcards--animatable {
      -webkit-transition: all 400ms ease;
              -o-transition: all 400ms ease;
              transition: all 400ms ease;
  }

  .stackedcards .stackedcards-container > *,
  .stackedcards-overlay {
      position: absolute;
      width: 100%; /* set 100% */
      height: 100%; /* set 100% */
      will-change: transform, opacity;
      top: 0;
      border-radius: 10px;
      min-width: 265px;
  }

  .stackedcards-overlay.left > div,
  .stackedcards-overlay.right > div,
  .stackedcards-overlay.top > div {
      width: 100%;
      height: 100%;
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
          -ms-flex-pack: center;
              justify-content: center;
  }

  .stackedcards-overlay.left,
  .stackedcards-overlay.right,
  .stackedcards-overlay.top {
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
          -ms-flex-pack: center;
              justify-content: center;
      left: 0;
      opacity: 0;
      top: 0;
      height: 100%;
  }

  .stackedcards-overlay.top,
  .stackedcards-overlay.right,
  .stackedcards-overlay.left {
      background: #fff;
  }

  .stackedcards-overlay.left:empty,
  .stackedcards-overlay.right:empty,
  .stackedcards-overlay.top:empty {
    display: none !important;
  }

  .stackedcards-overlay-hidden {
      display: none;
  }

  .stackedcards-origin-bottom {
      -webkit-transform-origin: bottom;
              -ms-transform-origin: bottom;
          transform-origin: bottom;
  }

  .stackedcards-origin-top {
      -webkit-transform-origin: top;
              -ms-transform-origin: top;
          transform-origin: top;
  }

  .stackedcards-bottom,
  .stackedcards-top,
  .stackedcards-none {
      background: #fff; /* set card background background */
      box-shadow: 0 6px 12px 0 rgba(0,0,0,0.30);
      height: 100%;
  }

  .stackedcards .stackedcards-container > :nth-child(1) {
      position: relative;
      display: block;
  }

  .description {
    font-size: 15px;
    color: #000;
    margin: 8px;
    margin-top: 0;
    height: 105px;
    overflow: hidden;
    margin-bottom: 32px;
  }

  .name {
    font-size: 18px;
    color: #000;
    font-weight: bold;
    margin: 8px;
    text-align: left;
    padding-top: 6px;
    margin-top: 0;
    margin-bottom: 2px;
    line-height: 1.15;
  }

  .cardImage {
    width: 324px;
    height: 218px;
    transition: height 0.5s;
    -moz-transition: height 0.5s;
    -webkit-transition: height 0.5s;
    -o-transition: height 0.5s;
  }

  .moduleLine {
    max-height: 4px;
    height: 4px;
    margin: 0;
    padding: 0;
    width: 324px;
    margin-top: -4px;
  }

  paper-icon-button {
    color: #000;
    width: 55px;
    height: 55px;
  }

  .innerHideContainer {
    text-align: center;
  }

  .card-content {
    height: 410px;
    width: 330px;
    overflow: hidden;
  }

  .hideUnhideContainer {
    position: absolute;
    bottom: 0;
    margin-bottom: 0;
    width: 100%;
  }

  #contentType {
    position: absolute;
    bottom: 10px;
    left: 13px;
    font-size: 11px;
    color: #bbb;
  }

  paper-icon-button {
    margin-bottom: -6px;
    padding-bottom: 0;
  }

  .imageCollapsed {
    height: 0px;
    overflow: hidden;
    transition: height 0.5s;
    -moz-transition: height 0.5s;
    -webkit-transition: height 0.5s;
    -o-transition: height 0.5s;
  }

  .fullsizeDescription {
    height: 100%;
  }

  .mainNavigator {
    height: 6px;
    max-height: 6px !important;
    margin: 8px;
    padding: 0;
    padding-top: 18px;
    width: 100%;
    vertical-align: bottom;
  }


  #moduleContentType {
    font-weight: 900;
    padding-right: 4px;
  }

  .mainNavigator.div {
    float: right;
  }

  [hidden] {
    display: none !important;
  }
/*----- Stacked Cards component css END -----*/
`;
