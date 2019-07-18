/**
@license
Copyright (c) 2010-2019 Citizens Foundation
*/

import { css } from 'lit-element';

export const DevOavConfig = JSON.parse(`
  {
    "cssProperties": [
      {
        "--app-primary-color": "#333"
      }
    ],
    "locales": {
      "en": {
        "pointsFor": "Points for",
        "pointsAgainst": "Points against",
        "favorite_info": "Use 🌟 for your favorite idea = two votes",
        "share_vote_by_pressing": "Share vote here",
        "budget_empty_info_1": "{amount} millions on offer",
        "budget_empty_info_2": "Use",
        "budget_empty_info_3": "to select ideas",
        "share_idea": "Share idea & vote",
        "design_pdf": "Initial design pdf",
        "moreInformation": "More information",
        "welcome_title": "My neighborhood – Participate!",
        "app_title": "My neighborhood – Participate!",
        "voting_areas": "Choose neighborhood",
        "menu": "Menu",
        "choose_a_neighbourhood_1": "",
        "choose_a_neighbourhood_2": "Choose a neighbourhood to cast your vote. 450 million have been allocated proportionately.",
        "error_not_found": "Not found",
        "general_error": "An error has occurred, we have been notified",
        "error_not_authorized": "Not authorized",
        "error_cant_connect": "Can't connect to server, please try again later",
        "error_invalid_public_key": "Invalid public key",
        "error_public_key_not_found": "Public key not found",
        "error_no_items_selected": "No items selected for vote",
        "error_does_not_fit_in_budget": "Does not fit in budget",
        "error_encryption": "Encryption error {err}",
        "error_could_not_post_vote": "Could not post vote, please try again later",
        "items_list": "Ideas",
        "items_on_map": "Maps",
        "ballot_area_name": "Choose projects for {area_name}",
        "selected_items_info": "You have selected {number_of_items} for a total of {selectedBudget} millions",
        "selected_items_info_mobile": "{number_of_items, plural, one {1 idea} other {{number_of_items} ideas} } - total {selectedBudget} millions",
        "selected_items_info_one_million": "You have selected {number_of_items} for a total of {selectedBudget} million",
        "selected_items_info_mobile_one_million": "{number_of_items, plural, one {1 idea} other {{number_of_items} ideas} } - total {selectedBudget} million",
        "budget_info_text": "Vote ideas for {area_name}",
        "budget_info_text_mobile": "Projects for {area_name}",
        "no_items_selected": "No items selected",
        "voting_completed": "Your vote has been received",
        "add_to_budget": "Select idea",
        "remove_from_budget": "Remove idea",
        "thank_you_1": "Thank you for participating!",
        "thank_you_2": "Your vote has been received and you have been logged out.",
        "thank_you_3": "You can vote again until October 30th but only the last vote is valid. Thanks for participating. Results will be published on www.reykjavik.is",
        "million": "million",
        "millions": "millions",
        "million_short": "m.",
        "image_item_tab": "Item image",
        "description_item_tab": "Item description",
        "map_item_tab": "Item location",
        "budget_left_text": "{budget_left} millions left",
        "more_info_description": "Points for and against",
        "close": "close",
        "vote": "Vote!",
        "postTabsDebate": "Debate",
        "postTabsLocation": "Location",
        "postTabsPhotos": "Myndir",
        "postNoLocation": "No location",
        "number_of_voters": "Total number of valid votes",
        "number_of_votes": "Number of voters in this neighborhood",
        "auth_dialog": "Authenticating and sending in vote",
        "select_favorite": "Select favorite for a double vote",
        "deselect_favorite": "Deselect favorite",
        "more_information": "More information"
      },
      "is": {
        "favorite_info": "Settu 🌟 við þína uppáhalds hugmynd = tvöfalt vægi",
        "share_vote_by_pressing": "Deildu kosningu hér",
        "budget_empty_info_1": "{amount} milljónir í boði",
        "budget_empty_info_2": "Notaðu",
        "budget_empty_info_3": "til að velja hugmyndir",
        "share_idea": "Deila hugmynd & kosningu",
        "design_pdf": "Frumhönnun PDF",
        "moreInformation": "Nánari upplýsingar",
        "welcome_title": "Hverfið mitt – Taktu þátt!",
        "app_title": "Hverfið mitt – Taktu þátt!",
        "voting_areas": "Veldu hverfi",
        "menu": "Valmynd",
        "choose_a_neighbourhood_1": "",
        "choose_a_neighbourhood_2": "Veldu þér hverfi til að kjósa í. 450 milljónum hefur verið skipt á milli hverfa eftir íbúafjölda.",
        "error_not_found": "Fannst ekki",
        "general_error": "Villa hefur komið upp, við höfum verið látin vita",
        "error_not_authorized": "Þú hefur ekki aðgang",
        "error_cant_connect": "Get ekki tengst vefþjóni, vinsamlegast prófaðu síðar",
        "error_invalid_public_key": "Dulkóðunarlykill ekki í lagi",
        "error_public_key_not_found": "Dulkóðunarlykill fannst ekki",
        "error_no_items_selected": "Það eru engar hugmyndir valdar í kosningu",
        "error_encryption": "Dulkóðunarvilla {err}",
        "error_does_not_fit_in_budget": "þessi hugmynd er of dýr fyrir það sem er eftir af peningum",
        "error_could_not_post_vote": "Það hefur komið upp villa og þitt atkvæði er ekki móttekið, vinsamlegast reyndu aftur síðar",
        "items_list": "Hugmyndir",
        "items_on_map": "Kort",
        "ballot_area_name": "Kjóstu hugmyndir fyrir {area_name}",
        "selected_items_info": "Þú hefur valið {number_of_items, plural, one {1 hugmynd} other {{number_of_items} hugmyndir}} fyrir {selectedBudget} milljónir",
        "selected_items_info_mobile": "{number_of_items, plural, one {1 hugmynd} other {{number_of_items} hugmyndir} } fyrir {selectedBudget} milljónir",
        "selected_items_info_one_million": "Þú hefur valið {number_of_items, plural, one {1 hugmynd} other {{number_of_items} hugmyndir} } fyrir {selectedBudget} milljón",
        "selected_items_info_mobile_one_million": "{number_of_items, plural, one {1 hugmynd} other {{number_of_items} hugmyndir} } fyrir {selectedBudget} milljón",
        "budget_info_text": "Kjóstu hugmyndir - {area_name}",
        "budget_info_text_mobile": "Kjóstu - {area_name}",
        "no_items_selected": "Engin hugmynd valin...",
        "voting_completed": "Atkvæði þitt hefur verið móttekið",
        "add_to_budget": "Velja hugmynd",
        "remove_from_budget": "Taka út hugmynd",
        "thank_you_1": "Takk fyrir þátttökuna!",
        "thank_you_2": "Atkvæði þitt hefur verið móttekið og þú hefur verið skráð(ur) út.",
        "thank_you_3": "Þú getur kosið aftur en síðasta kosning gildir. Kosningu lýkur 30. október. Niðurstöður kosninga verða birtar á heimasíðu Reykjavíkurborgar.",
        "million": "milljón",
        "millions": "milljónir",
        "million_short": "mkr",
        "image_item_tab": "Mynd",
        "description_item_tab": "Nánari upplýsingar",
        "map_item_tab": "Staðsetning",
        "budget_left_text": "{budget_left} milljónir eftir",
        "more_info_description": "Rök með og á móti",
        "close": "loka",
        "vote": "Kjósa!",
        "postTabsDebate": "Rök",
        "postTabsLocation": "Staðsetning",
        "postTabsPhotos": "Myndir",
        "postNoLocation": "Engin staðsetning",
        "number_of_voters": "Heildarfjöldi gildra atkvæða",
        "number_of_votes": "Fjöldi kjósenda í þessu hverfi",
        "auth_dialog": "Innskráning og innsending á atkvæði",
        "select_favorite": "Settu stjörnu við uppáhalds hugmynd fyrir tvöfalt vægi",
        "deselect_favorite": "Afvelja uppáhalds hugmynd",
        "more_information": "Nánar um hugmynd"
      },
      "pl": {
        "favorite_info": "Kliknij na 🌟 aby wybrać ulubiony pomysł = dwa głosy",
        "share_vote_by_pressing": "Podziel się głosuj",
        "budget_empty_info_1": "{amount} milionów na pomysł - wykorzystaj",
        "budget_empty_info_2": "wybierz pomysł",
        "share_idea": "Podziel się pomysłem & głosuj",
        "design_pdf": "Projekt pierwotny pdf",
        "moreInformation": "Więcej informacji",
        "welcome_title": "Moja dzielnica – Weź udział!",
        "app_title": "Moja dzielnica – Weź udział!",
        "voting_areas": "Wybierz dzielnicę",
        "menu": "Menu",
        "choose_a_neighbourhood_1": "",
        "choose_a_neighbourhood_2": "Wybierz dzielnicę, aby oddać głos. 450 milionów zostało rozdzielone na wszystkie dzielnice.",
        "error_not_found": "Nie znaleziono",
        "general_error": "Wystąpił błąd, zostaliśmy o nim poinformowani",
        "error_not_authorized": "Brak autoryzacji",
        "error_cant_connect": "Brak łączności z serwerem, spróbuj ponownie",
        "error_invalid_public_key": "Nieprawidłowa identyfikacja",
        "error_public_key_not_found": "Identyfikacja nie znaleziona",
        "error_no_items_selected": "Nie wybrano obiektu do głosowania",
        "error_does_not_fit_in_budget": "Nie pasuje do budżetu",
        "error_encryption": "Błąd kodowania  {err}",
        "error_could_not_post_vote": "Nie można wysłać głosu, spróbuj ponownie",
        "items_list": "Pomysły",
        "items_on_map": "Mapy",
        "ballot_area_name": "Wybierz projekt dla {area_name}",
        "selected_items_info": "Wybrałeś {number_of_items} za sumę {selectedBudget} millionów",
        "selected_items_info_mobile": "{number_of_items, plural, one {1 idea} other {{number_of_items} ideas} } - razem {selectedBudget} milionów",
        "selected_items_info_one_million": "Wybrałeś {number_of_items} za sumę {selectedBudget} milionów",
        "selected_items_info_mobile_one_million": "{number_of_items, plural, one {1 idea} other {{number_of_items} ideas} } - razem {selectedBudget} milionów",
        "budget_info_text": "Głosuj na pomysły w {area_name}",
        "budget_info_text_mobile": "Projekty dla  {area_name}",
        "no_items_selected": "Nie wybrano",
        "voting_completed": "Twój głos został oddany",
        "add_to_budget": "Dodaj do budżetu",
        "remove_from_budget": "Usuń z budżetu",
        "thank_you_1": "Dziękujemy za udział w głosowaniu!",
        "thank_you_2": "Twój głos został oddany i zostałeś wylogowany.",
        "thank_you_3": "Możesz głosować ponownie do 30 października. Liczy się twój ostatni głos. Dziękujemy za udział w głosowaniu. Wyniki będą ogłoszona na www.reykjavik.is",
        "million": "mln",
        "millions": "mln",
        "million_short": "m.",
        "image_item_tab": "Zdjęcie obiektu",
        "description_item_tab": "Opis obiektu",
        "map_item_tab": "Lokalizacja obiektu",
        "budget_left_text": "{budget_left} zostało milionów",
        "more_info_description": "Pomysł na stronie pomysłów",
        "close": "Zamknij",
        "vote": "Głosuj!",
        "postTabsDebate": "Debatuj",
        "postTabsLocation": "Lokalizacja",
        "postTabsPhotos": "Zdjęcia",
        "postNoLocation": "Brak lokalizacji",
        "number_of_voters": "Liczba ważnych głosów",
        "number_of_votes": "Liczba głosujących w tej dzielnicy",
        "auth_dialog": "Autoryzacja i wysyłanie głosu",
        "select_favorite": "Dodaj do ulubionych, aby uzyskać dodatkowy głos",
        "deselect_favorite": "Odznacz ulubione",
        "more_information": "Więcej informacji"
      }
    }
  }
`);
