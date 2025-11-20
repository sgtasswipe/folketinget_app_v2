import {StyleSheet} from 'react-native';

const partyColours = {
    S: {letter: 'S', colour: '#e53838'},        // Socialdemokratiet
    V: {letter: 'V', colour: '#205da5'},        // Venstre
    M: {letter: 'M', colour: '#b48cd2'},        // Moderaterne
    DD: {letter: 'DD', colour: '#78a0e1'},       // Danmarks Demokraterne
    SF: {letter: 'SF', colour: '#ef75ca'},       // Socialistisk Folkeparti
    LA: {letter: 'LA', colour: '#1db9ce'},       // Liberal Alliance
    KF: {letter: 'KF', colour: '#8b8474'},       // Kristendemokraterne
    EL: {letter: 'EL', colour: '#eb7341'},       // Enhedslisten
    DF: {letter: 'DF', colour: '#f9c153'},       // Dansk Folkeparti
    RV: {letter: 'RV', colour: '#78378c'},       // Radikale Venstre
    ALT: {letter: 'ALT', colour: '#32913c'},      // Alternativet
    NB: {letter: 'NB', colour: '#127b7f'},       // Nye Borgerlige
    UFG: {letter: 'UFG', colour: '#8d95a5'}   // Uden for folketingsgruppen
}

const generalStyles = StyleSheet.create({
    resultTrue: {
    color: 'green',
    }
    ,
    resultFalse: {
        color: 'red',
  },
    date: {
        fontSize: 12,
        color: '#666',
    },
})

export {partyColours, generalStyles}