'use strict';

const answerKeys = {
  Listening: [
    ['Westbrook Language Centre','Westbrook Language Center'],['14 October','October 14','14th October'],['Tuesday and Thursday','Tuesdays and Thursdays','Tuesday, Thursday'],['8','8 pm','8:00','8:00 pm'],['240','240 pounds','£240'],['A','course book','a course book'],['Patel'],['07700 900 416','07700900416'],['B','intermediate'],['last month'],
    ['9','9 am','09:00','9:00 am'],['the main gate','main gate'],['2','2 pm','14:00','2:00 pm'],['the information desk','information desk'],['a helmet','helmets'],['B','woodland area','the woodland area'],['administration building','the administration building','a member of staff'],['C','bird-watching tower','bird watching tower'],['12','twelve'],['5:30','5:30 pm','17:30','five thirty'],
    ['A','a survey','survey'],['6','six','six coordinators'],['limitations','the limitations'],['C','Leo'],['the introduction','introduction'],['Friday'],['22','22nd','the 22nd'],['12','12 minutes','twelve minutes'],['B','the comparison between new and established gardens','garden comparisons'],['B','time for questions','questions'],
    ['information gathered during the day','information'],['a regular sleep schedule','regular sleep schedule'],['B','their brains and bodies are developing','brains and bodies are developing'],['melatonin'],['B','delay melatonin release','delays melatonin release'],['attention'],['difficulty returning to a task','difficult to return to a task','hard to return to a task'],['physical exercise','exercise'],['immediately before bedtime','before bedtime'],['A','sleep and learning']
  ],
  Reading: [
    ['April'],['4','four'],['B','local residents'],['Sunday','Sundays'],['C','three weeks'],['A','when another reader has reserved it','reserved by another reader'],['five working days','5 working days'],['B','a social enterprise','social enterprise'],['reading programmes for children','children’s reading programmes'],['the bicycle racks behind the building','bicycle racks behind the building','bicycle racks'],
    ['the quiet study room','quiet study room'],['eight books','8 books'],['a meeting room','meeting room'],
    ['A','how work is organised','how work is organized'],['starting and finishing earlier','compressing hours into fewer days','compressed hours','flexible start and finish times'],['managing family responsibilities','reduced commuting time','less commuting'],['improved staff retention','access to applicants who live further away','staff retention'],['periods when everyone is available','shared availability periods','when everyone is available'],['B','outcomes'],['new employees'],['colleagues are rarely in the same place','colleagues rarely meet in person','less time together'],['C','regularly'],['business requirements and employee feedback','business needs and employee feedback'],['access to applicants who live further away','applicants who live further away'],['periods when everyone is available','shared availability periods'],['review the flexible-working policy','review the policy'],
    ['surface temperatures','temperatures'],['airborne particles','particles'],['they absorb rainwater and slow its flow','slow the flow into drainage systems','slowing water flow'],['roots have little space','limited root space','little root space'],['A','the tree’s full life','the full life of a tree'],['a pest or disease can affect the whole street','vulnerable to pests or disease','pests and diseases'],['local wildlife','wildlife'],['B','early in the process','early'],['maintenance responsibilities','maintenance responsibilities are clear'],['A','urban trees provide benefits but need careful planning','trees provide benefits but need careful planning'],['slow the flow into drainage systems','slowing the flow into drainage systems'],['overhead cables','cables'],['a well-planned urban forest','well-planned urban forest'],['maintenance']
  ]
};

function normalize(value) {
  return String(value ?? '').toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
function estimateBand(correct) {
  if (correct >= 39) return 9;
  if (correct >= 37) return 8.5;
  if (correct >= 35) return 8;
  if (correct >= 32) return 7.5;
  if (correct >= 30) return 7;
  if (correct >= 26) return 6.5;
  if (correct >= 23) return 6;
  if (correct >= 18) return 5.5;
  if (correct >= 16) return 5;
  if (correct >= 13) return 4.5;
  if (correct >= 10) return 4;
  if (correct >= 8) return 3.5;
  if (correct >= 6) return 3;
  if (correct >= 4) return 2.5;
  if (correct >= 2) return 2;
  if (correct === 1) return 1.5;
  return 1;
}
function scoreAnswers(skill, answers) {
  const keys = answerKeys[skill];
  if (!keys) return null;
  let correct = 0;
  let answered = 0;
  for (let index = 0; index < keys.length; index++) {
    const raw = String(answers?.[index + 1] ?? '').trim();
    if (raw) answered++;
    if (raw && keys[index].some(candidate => normalize(raw) === normalize(candidate))) correct++;
  }
  return {
    skill, correct, answered, total: keys.length,
    percentage: Math.round((correct / keys.length) * 100),
    bandEstimate: estimateBand(correct),
    scoringNotice: 'Unofficial practice estimate based on original sample questions. This is not an official IELTS band score.'
  };
}

module.exports = { answerKeys, normalize, scoreAnswers, estimateBand };
