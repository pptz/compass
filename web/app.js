(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('compass-data').textContent);
  const state = { lang: compassInitialLanguage(), form: 'short', optionOrders: createOptionOrders(), currentIndex: 0, answers: {}, importance: {}, view: 'quiz', historical: false, estimates: true, questionIds: CompassScoring.createRun(data,'short'), seen: new Set() };
  state.seen = new Set(state.questionIds);
  const $ = id => document.getElementById(id);
  let answerTransition = null;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function unlockQuestion() {
    $('questions').inert=false;
    $('questions').removeAttribute('aria-busy');
  }
  function cancelAnswerTransition() {
    if(answerTransition){
      clearTimeout(answerTransition.timer);
      answerTransition.animation?.cancel();
      answerTransition=null;
    }
    unlockQuestion();
  }
  function lockQuestion() {
    $('questions').inert=true;
    $('questions').setAttribute('aria-busy','true');
    ['back','next','calculate'].forEach(id=>$(id).disabled=true);
  }
  function confirmAnswer(input) {
    if(answerTransition)return;
    state.answers[input.name]=input.value;
    input.closest('.choice').classList.add('is-confirmed');
    progress();
    const pending={timer:null,animation:null};
    answerTransition=pending;
    lockQuestion();
    const advance=()=>{
      if(answerTransition!==pending)return;
      pending.animation?.cancel();
      answerTransition=null;
      unlockQuestion();
      advanceQuestion();
      if(reducedMotion())return;
      const entering={timer:null,animation:null};
      answerTransition=entering;
      lockQuestion();
      const destination=state.view==='results'?$('results'):$('questions');
      entering.animation=destination.animate(
        [{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
        {duration:350,easing:'cubic-bezier(.2,.7,.2,1)'}
      );
      entering.animation.finished.then(()=>{
        if(answerTransition!==entering)return;
        answerTransition=null;unlockQuestion();progress();
        if(state.view==='quiz')document.querySelector('.question legend')?.focus({preventScroll:true});
      }).catch(()=>{});
    };
    // Let the selected state paint and remain readable before changing the question.
    pending.timer=setTimeout(()=>{
      if(answerTransition!==pending)return;
      if(reducedMotion()){advance();return;}
      pending.animation=$('questions').animate(
        [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],
        {duration:300,easing:'ease-in',fill:'forwards'}
      );
      pending.animation.finished.then(advance).catch(()=>{});
    },550);
  }
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const words = {
  "en": {
    "brand": "Ideological Compass",
    "eyebrow": "Your views. Published positions.",
    "title": "Your Choice — Your Vote",
    "subtitle": "Choose between concrete policy approaches. Each short run covers all six topics, with a second question from four randomly chosen topics; the long run shuffles all 22.",
    "short": "Short · 10 questions",
    "long": "Long · 22 questions",
    "reset": "Start again",
    "quiz": "Questions",
    "results": "Results",
    "calculate": "See my comparisons →",
    "edit": "Edit answers",
    "answered": "answered",
    "skipped": "skipped",
    "of": "of",
    "checked": "Evidence checked",
    "skipNote": "Set importance before choosing an answer. An answer or Skip moves to the next question. Use Back to edit earlier choices; Next keeps a saved answer. Change question draws an unused topic.",
    "resultTitle": "Your comparisons",
    "resultSubtitle": "Similarity across your answered questions, ranked from highest to lowest. Sourced positions and inferred contributions are shown separately.",
    "historical": "Include historical sources",
    "currentNote": "Unknown party positions add no points and stay in the denominator. Your skips are excluded.",
    "historyNote": "Historical sources are included; check their dates.",
    "coverage": "positions documented",
    "matched": "questions with positions or estimates",
    "historyCount": "historical components",
    "complete": "fully evidenced questions",
    "inspect": "Inspect answers and sources",
    "user": "You",
    "party": "Party",
    "unknown": "Unknown / insufficient evidence",
    "excluded": "Excluded in current mode",
    "clarification": "About this issue",
    "component": "Policy component",
    "empty": "Answer at least one question to explore the comparisons.",
    "method": "How the calculation works",
    "methodBody": "Each question uses your selected importance (Important by default), split equally between two policy components. Specific positions use the graded similarity tables. A broad position, such as allowing Shabbat transport without specifying its scale, matches every included operating-service alternative equally and does not match a ban. Sources and reviewed secondary reports contribute normally; reasoned inferences contribute at 60% strength and can be disabled. The 60% factor is an editorial convention, not a statistical confidence estimate. We divide by the importance of ALL substantive answers, including remaining unknown party positions. Skips are excluded. Two complete sourced matches and eight unknowns still give 20% at equal importance. Results sort by total similarity, then documented evidence. Older sources require the separate historical switch.",
    "footer": "Local research preview · answers stay in this page and disappear on reload. No analytics, account, or external requests. Source links open only when clicked. Source explanations are currently in English.",
    "domains": {
      "security": "Security & service",
      "institutions": "Democratic institutions",
      "religion": "Religion & state",
      "economy": "Economy & welfare",
      "services": "Education & public services",
      "women": "Status of Women"
    },
    "statuses": {
      "P": "Published policy",
      "S": "Attributable statement",
      "H": "Historical document",
      "R": "Secondary report",
      "U": "Unknown",
      "I": "Reasoned inference"
    },
    "explore": "Explore the issue and its open questions ↗",
    "allIssues": "Explore all the issues ↗",
    "further": "Further reading",
    "overlap": "How these approaches overlap",
    "overlapNote": "Editorial similarity estimates, not measured probabilities. Letters identify choices; they do not indicate a scale.",
    "componentScore": "Estimated component similarity",
    "questionScore": "Similarity on this question",
    "replace": "Use this question instead",
    "replacementPrompt": "Prefer a different topic? Choose an unused question.",
    "chooseReplacement": "Select a replacement…",
    "noSpare": "No unused questions remain in this run.",
    "excludedEvidence": "Historical evidence exists for these answers but is excluded by the current filter.",
    "includeEvidence": "Include historical sources",
    "noCoded": "No enabled position or estimate is coded for these answers. Zero means no established match, not proven disagreement.",
    "bankEvidence": "Some positions are coded on other questions in the bank.",
    "coverageNote": "“Positions documented” measures source coverage, weighted by your importance choices. It excludes inferences and is not your match percentage.",
    "confirmedScore": "Confirmed agreement",
    "historicalConfirmedScore": "Confirmed agreement · includes older sources",
    "noEvidenceScore": "No usable position data",
    "importance": "How important is this issue to you?",
    "importanceHint": "Importance sets this question’s weight in your result.",
    "importanceChoices": [
      "Critical",
      "Important",
      "Not very important",
      "Not important"
    ],
    "changeQuestion": "Change question",
    "topicsLabel": "Quiz topics",
    "back": "Back",
    "next": "Next",
    "step": "Question {current} of {total}",
    "estimates": "Include reasoned estimates",
    "estimateNote": "Labeled inferences contribute at 60% strength and can be disabled. Each card separates their contribution.",
    "estimatedScore": "Similarity · includes estimates",
    "documentedPart": "From sourced positions",
    "estimatedPart": "Added by estimates",
    "inferenceHint": "Editorial inference: contributes at 60% strength. This is a scoring convention, not a measured probability.",
    "broadHint": "Only this shared policy direction is known or estimated. The listed alternatives match equally; no preference between them is implied."
  },
  "he": {
    "brand": "מצפן אידאולוגי",
    "eyebrow": "העמדות שלך. המדיניות המוצהרת.",
    "title": "הבחירה שלך - הקול שלך",
    "subtitle": "בחרו בין דרכי פעולה קונקרטיות. הסבב הקצר כולל את כל ששת התחומים ועוד שאלה מארבעה תחומים שנבחרים באקראי; הסבב המלא מערבב את כל 22 השאלות.",
    "short": "קצר · 10 שאלות",
    "long": "מלא · 22 שאלות",
    "reset": "התחלה מחדש",
    "quiz": "שאלות",
    "results": "תוצאות",
    "calculate": "להשוואות שלי ←",
    "edit": "עריכת תשובות",
    "answered": "תשובות",
    "skipped": "דילוגים",
    "of": "מתוך",
    "checked": "בדיקת מקורות",
    "skipNote": "בחרו חשיבות לפני התשובה. תשובה או דילוג מעבירים לשאלה הבאה. ״חזרה״ מאפשרת לערוך בחירות קודמות; ״הבא״ שומר תשובה קיימת. ״החלפת שאלה״ מגרילה נושא שטרם הוצג.",
    "resultTitle": "ההשוואות שלך",
    "resultSubtitle": "דמיון בשאלות שעניתם עליהן, מהגבוה לנמוך. תרומת העמדות המתועדות וההערכות מוצגת בנפרד.",
    "historical": "הכללת מקורות היסטוריים",
    "currentNote": "עמדות לא ידועות אינן מוסיפות נקודות ונשארות במכנה. הדילוגים שלכם אינם נכללים.",
    "historyNote": "נכללים מקורות היסטוריים — שימו לב לתאריכים.",
    "coverage": "עמדות מתועדות",
    "matched": "שאלות עם עמדה או הערכה",
    "historyCount": "מרכיבים ממקורות היסטוריים",
    "complete": "שאלות עם מידע מלא",
    "inspect": "פירוט התשובות והמקורות",
    "user": "התשובה שלך",
    "party": "המפלגה",
    "unknown": "לא ידוע / אין די מידע",
    "excluded": "לא נכלל במצב העדכני",
    "clarification": "על הסוגיה",
    "component": "מרכיב מדיניות",
    "empty": "יש לענות על שאלה אחת לפחות כדי לעיין בהשוואות.",
    "method": "איך מתבצע החישוב?",
    "methodBody": "חשיבות השאלה (״חשוב״ כברירת מחדל) מתחלקת שווה בשווה בין שני מרכיבים. עמדות מסוימות מושוות בטבלאות דמיון מדורג. עמדה כללית, כגון תמיכה בתחבורה בשבת ללא היקף מוגדר, תואמת באותה מידה לכל חלופות ההפעלה הכלולות ואינה תואמת לאיסור. תוכניות, הצהרות ודיווחים משניים שנבדקו מקבלים משקל מלא; הערכות מנומקות תורמות במשקל 60% וניתן לכבות אותן. זהו כלל עריכתי ולא הסתברות סטטיסטית. מחלקים בחשיבות כל התשובות המהותיות, כולל עמדות מפלגה שעדיין אינן ידועות. דילוגים אינם נכללים. שתי התאמות מלאות ממקורות ושמונה עמדות חסרות עדיין נותנות 20% בחשיבות שווה. המיון הוא לפי הדמיון הכולל ואז היקף התיעוד. מקורות ישנים מופעלים בנפרד.",
    "footer": "תצוגת מחקר מקומית · התשובות נשארות בדף ונמחקות בטעינה מחדש. ללא חשבון, כלי מעקב או בקשות חיצוניות. קישורי המקורות נפתחים רק בלחיצה. הסברי המקורות מוצגים כעת באנגלית.",
    "domains": {
      "security": "ביטחון ושירות",
      "institutions": "מוסדות דמוקרטיים",
      "religion": "דת ומדינה",
      "economy": "כלכלה ורווחה",
      "services": "חינוך ושירותים ציבוריים",
      "women": "מעמד האישה"
    },
    "statuses": {
      "P": "מדיניות שפורסמה",
      "S": "הצהרה מיוחסת",
      "H": "מסמך היסטורי",
      "R": "דיווח משני",
      "U": "לא ידוע",
      "I": "הערכה מנומקת"
    },
    "explore": "להעמקה בסוגיה ובשאלות הפתוחות ↖",
    "allIssues": "להיכרות עם כל הסוגיות ↖",
    "further": "לקריאה נוספת",
    "overlap": "כיצד הגישות חופפות",
    "overlapNote": "אומדני דמיון עריכתיים, לא הסתברויות שנמדדו. האותיות מזהות חלופות ואינן סולם.",
    "componentScore": "אומדן הדמיון במרכיב",
    "questionScore": "דמיון בשאלה זו",
    "replace": "להחליף בשאלה הזו",
    "replacementPrompt": "מעדיפים נושא אחר? בחרו שאלה שטרם הוצגה.",
    "chooseReplacement": "בחירת שאלה חלופית…",
    "noSpare": "לא נותרו שאלות שלא הוצגו בסבב הזה.",
    "excludedEvidence": "יש מקורות היסטוריים לתשובות אלה, אך הם מוחרגים במסנן הנוכחי.",
    "includeEvidence": "הכללת מקורות היסטוריים",
    "noCoded": "אין עמדות או הערכות מופעלות לתשובות אלה. אפס פירושו שאין התאמה מבוססת, לא שהוכחה מחלוקת.",
    "bankEvidence": "קיימות עמדות מקודדות בשאלות אחרות במאגר.",
    "coverageNote": "״עמדות מתועדות״ מודד את היקף המקורות בשקלול החשיבות שבחרתם. הוא אינו כולל הערכות ואינו אחוז ההתאמה שלכם.",
    "confirmedScore": "התאמה מתועדת",
    "historicalConfirmedScore": "התאמה מתועדת · כולל מקורות ישנים",
    "noEvidenceScore": "אין נתוני עמדה מתאימים",
    "importance": "עד כמה הסוגיה הזו חשובה לך?",
    "importanceHint": "החשיבות קובעת את משקל השאלה בתוצאה שלך.",
    "importanceChoices": [
      "קריטי",
      "חשוב",
      "לא כל כך חשוב",
      "לא חשוב"
    ],
    "changeQuestion": "החלפת שאלה",
    "topicsLabel": "נושאי השאלון",
    "back": "חזרה",
    "next": "הבא",
    "step": "שאלה {current} מתוך {total}",
    "estimates": "הכללת הערכות מנומקות",
    "estimateNote": "הערכות מסומנות תורמות במשקל של 60% וניתן לכבות אותן. תרומתן מוצגת בנפרד בכל כרטיס.",
    "estimatedScore": "דמיון הכולל הערכות",
    "documentedPart": "לפי מקורות",
    "estimatedPart": "תוספת מהערכות",
    "inferenceHint": "הערכה עריכתית: תרומה במשקל של 60%. זהו כלל חישוב ולא הסתברות שנמדדה.",
    "broadHint": "רק הכיוון המשותף ידוע או מוערך. החלופות הרשומות תואמות אותו במידה שווה, ללא ייחוס העדפה ביניהן."
  },
  "ru": {
    "brand": "Идеологический Компас",
    "eyebrow": "Ваши взгляды. Публичные позиции.",
    "title": "Ваш Выбор — Ваш Голос",
    "subtitle": "Выбирайте конкретные политические подходы к различным темам.\nКороткий опрос включает все шесть тем и ещё по вопросу из четырёх случайно выбранных тем; полный перемешивает все 22 вопроса.",
    "short": "Короткий · 10 вопросов",
    "long": "Полный · 22 вопроса",
    "reset": "Начать заново",
    "quiz": "Вопросы",
    "results": "Результаты",
    "calculate": "Посмотреть сравнения →",
    "edit": "Изменить ответы",
    "answered": "ответов",
    "skipped": "пропусков",
    "of": "из",
    "checked": "Проверка источников",
    "skipNote": "Выберите важность перед ответом. Ответ или пропуск переводит к следующему вопросу. «Обратно» позволяет изменить предыдущие выборы; «Далее» сохраняет прежний ответ. «Сменить вопрос» подставляет запасную тему.",
    "resultTitle": "Ваши сравнения",
    "resultSubtitle": "Сходство по отвеченным вопросам, от большего к меньшему. Вклад позиций из источников и предположений показан отдельно.",
    "historical": "Включить старые источники",
    "currentNote": "Неизвестные позиции не добавляют баллов и остаются в знаменателе. Ваши пропуски исключаются.",
    "historyNote": "Включены старые источники — обращайте внимание на даты.",
    "coverage": "данных о позиции",
    "matched": "вопросов с позицией или оценкой",
    "historyCount": "компонентов из старых источников",
    "complete": "вопросов с полными данными",
    "inspect": "Посмотреть ответы и источники",
    "user": "Вы",
    "party": "Партия",
    "unknown": "Неизвестно / недостаточно данных",
    "excluded": "Исключено текущим фильтром",
    "clarification": "Об этой проблеме",
    "component": "Компонент политики",
    "empty": "Ответьте хотя бы на один вопрос, чтобы увидеть сравнения.",
    "method": "Как считается сходство?",
    "methodBody": "Важность вопроса («Важно» по умолчанию) делится поровну между двумя компонентами. Конкретные позиции сравниваются по таблицам частичного сходства. Общая позиция, например поддержка транспорта по субботам без уточнения масштаба, одинаково совпадает со всеми соответствующими вариантами движения и не совпадает с запретом. Позиции из программ, заявлений и проверенных вторичных источников учитываются полностью; обоснованные предположения — с коэффициентом 0,6, и их можно отключить. Этот коэффициент — редакционное правило, а не статистическая вероятность. Делим на суммарную важность ВСЕХ содержательных ответов, включая оставшиеся неизвестные позиции партии. Пропуски исключаются. Два полных совпадения по источникам и восемь неизвестных позиций всё ещё дают 20% при равной важности. Сортировка — по общему сходству, при равенстве по полноте источников. Старые источники включаются отдельно.",
    "footer": "Локальная исследовательская версия · ответы остаются на странице и исчезают при перезагрузке. Без аккаунта и аналитики. Внешние ссылки открываются только по нажатию. Примечания к партийным источникам пока на английском; язык внешнего материала указан у ссылки.",
    "domains": {
      "security": "Безопасность и служба",
      "institutions": "Демократические институты",
      "religion": "Религия и государство",
      "economy": "Экономика и социальная поддержка",
      "services": "Образование и общественные услуги",
      "women": "Положение Женщины"
    },
    "statuses": {
      "P": "Опубликованная политика",
      "S": "Атрибутированное заявление",
      "H": "Исторический документ",
      "R": "Вторичное сообщение",
      "U": "Неизвестно",
      "I": "Обоснованное предположение"
    },
    "explore": "Подробнее о проблеме и открытых вопросах ↗",
    "allIssues": "Обзор всех тем ↗",
    "further": "Дополнительное чтение",
    "overlap": "Насколько близки эти подходы",
    "overlapNote": "Редакционные оценки сходства, не измеренные вероятности. Буквы обозначают варианты, а не шкалу.",
    "componentScore": "Оценка сходства компонента",
    "questionScore": "Сходство по этому вопросу",
    "replace": "Заменить этим вопросом",
    "replacementPrompt": "Предпочитаете другую тему? Выберите ещё не показанный вопрос.",
    "chooseReplacement": "Выберите замену…",
    "noSpare": "В этом запуске не осталось неиспользованных вопросов.",
    "excludedEvidence": "По этим ответам есть старые источники, исключённые текущим фильтром.",
    "includeEvidence": "Включить старые источники",
    "noCoded": "Для этих ответов нет включённых позиций или оценок. Ноль означает отсутствие установленного совпадения, а не доказанное несогласие.",
    "bankEvidence": "Некоторые позиции закодированы для других вопросов банка.",
    "coverageNote": "«Данные о позиции» — полнота источников с учётом выбранной важности. Она не включает предположения и не означает процент совпадения.",
    "confirmedScore": "Подтверждённое совпадение",
    "historicalConfirmedScore": "Подтверждённое совпадение · со старыми источниками",
    "noEvidenceScore": "Нет пригодных данных о позиции",
    "importance": "Насколько этот вопрос важен для вас?",
    "importanceHint": "Важность определяет вес вопроса в вашем результате.",
    "importanceChoices": [
      "Критично",
      "Важно",
      "Не очень важно",
      "Не важно"
    ],
    "changeQuestion": "Сменить вопрос",
    "topicsLabel": "Темы теста",
    "back": "Обратно",
    "next": "Далее",
    "step": "Вопрос {current} из {total}",
    "estimates": "Учитывать обоснованные предположения",
    "estimateNote": "Помеченные предположения учитываются с коэффициентом 0,6; их можно отключить. Их вклад показан отдельно.",
    "estimatedScore": "Сходство с учётом предположений",
    "documentedPart": "По источникам",
    "estimatedPart": "Добавлено предположениями",
    "inferenceHint": "Редакционное предположение: учитывается с коэффициентом 0,6. Это правило расчёта, а не измеренная вероятность.",
    "broadHint": "Известно или предполагается только общее направление. Перечисленные варианты совпадают с ним одинаково; предпочтение одного из них не приписывается."
  }
};
  const t = () => words[state.lang];
  const questions = () => state.questionIds.map(id=>data.questions.find(q=>q.id===id));
  function createOptionOrders() {
    return Object.fromEntries(data.questions.map(q=>[q.id,CompassScoring.shuffle(q.options.map(o=>o.id))]));
  }
  const optionsFor = q => state.optionOrders[q.id].map(id=>q.options.find(o=>o.id===id));
  const issueUrl = q => `issues.html?lang=${state.lang}${q ? '#'+q.id : ''}`;
  const letter = i => state.lang === 'he' ? 'אבגדהו'[i] : state.lang === 'ru' ? 'АБВГДЕ'[i] : String.fromCharCode(65+i);
  const spareQuestions = () => data.questions.filter(q=>!state.seen.has(q.id));
  const percent = n => `${Math.round(n * 100)}%`;
  const componentValue = (dimension, value) => dimension.values.find(v => v.id === value)?.[state.lang] || t().unknown;
  const readingLinks = q => q.help.links.map(link=>`<a href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.title[state.lang])} <bdi>[${link.language.toUpperCase()}]</bdi> ↗</a>`).join('');
  function overlapTable(q) {
    const options=optionsFor(q);
    return `<div class="table-scroll"><table class="overlap-table"><caption>${escape(t().overlap)}</caption><thead><tr><th></th>${options.map((o,i)=>`<th scope="col" title="${escape(o[state.lang])}">${letter(i)}</th>`).join('')}</tr></thead><tbody>${options.map((a,i)=>`<tr><th scope="row" title="${escape(a[state.lang])}">${letter(i)}</th>${options.map(b=>`<td>${percent(CompassScoring.optionSimilarity(q,a,b))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${escape(t().overlapNote)}</p>`;
  }
  function replacementHtml(q) {
    if(state.form !== 'short' || questionImportance(q.id)!==0.1) return '';
    const spare = spareQuestions().sort((a,b)=>Number(b.domain===q.domain)-Number(a.domain===q.domain));
    if(!spare.length) return `<p class="no-spares">${escape(t().noSpare)}</p>`;
    return `<label class="replacement-label" for="replacement-${q.id}">${escape(t().replacementPrompt)}</label><div class="replacement-controls"><select id="replacement-${q.id}" class="replacement-select" data-question="${q.id}"><option value="">${escape(t().chooseReplacement)}</option>${spare.map(s=>`<option value="${s.id}">${escape(t().domains[s.domain])}: ${escape(s[state.lang])}</option>`).join('')}</select><button type="button" class="replace-question" data-question="${q.id}" disabled>${escape(t().replace)}</button></div>`;
  }

  const questionImportance = id => state.importance[id] ?? CompassScoring.defaultImportance;
  const importanceLabel = id => t().importanceChoices[CompassScoring.importanceWeights.indexOf(questionImportance(id))];
  function renderQuestions() {
    const index=state.currentIndex, q=questions()[index];
    $('questions').innerHTML = `
      <article class="question" data-question="${q.id}">
        <div class="question-meta"><span class="question-number">${String(index+1).padStart(2,'0')}</span><span class="question-domain">${escape(t().domains[q.domain])}</span><span class="help-wrap"><button class="help-button" type="button" aria-expanded="false" aria-controls="help-${q.id}" aria-label="${escape(t().clarification)}: ${escape(q[state.lang])}">?</button><span id="help-${q.id}" class="issue-tooltip" role="region" aria-label="${escape(t().clarification)}" hidden><span>${escape(q.help.overview[state.lang])}</span><a href="${issueUrl(q)}" target="_blank" rel="noopener">${escape(t().explore)}</a></span></span></div>
        <fieldset><legend tabindex="-1">${escape(q[state.lang])}</legend>
        <div class="question-importance"><label for="importance-${q.id}">${escape(t().importance)}</label><select class="importance-select" id="importance-${q.id}" data-question="${q.id}" aria-describedby="importance-hint-${q.id}">${CompassScoring.importanceWeights.map((weight,i)=>`<option value="${weight}" ${questionImportance(q.id)===weight ? 'selected' : ''}>${escape(t().importanceChoices[i])}</option>`).join('')}${state.form==='short' ? `<option value="__replace" ${spareQuestions().length ? '' : 'disabled'}>${escape(t().changeQuestion)}</option>` : ''}</select><small id="importance-hint-${q.id}">${escape(t().importanceHint)}</small></div>
        <div id="replace-${q.id}" class="replacement">${replacementHtml(q)}</div>
        <div class="choices">
        ${optionsFor(q).map((c,i)=>`<label class="choice"><input type="radio" name="${q.id}" value="${escape(c.id)}" ${state.answers[q.id]===c.id ? 'checked' : ''}><span class="option-letter" aria-hidden="true">${letter(i)}</span><span>${escape(c[state.lang])}</span></label>`).join('')}
        <div class="change-question-control"><button type="button" class="change-question" data-question="${q.id}" ${spareQuestions().length ? '' : 'disabled'} aria-describedby="spares-${q.id}">${escape(t().changeQuestion)}</button><small id="spares-${q.id}" ${spareQuestions().length ? 'hidden' : ''}>${escape(t().noSpare)}</small></div>
        ${data.skipped_choices.map(c=>`<label class="choice skip"><input type="radio" name="${q.id}" value="${escape(c.id)}" ${state.answers[q.id]===c.id ? 'checked' : ''}><span>${escape(c[state.lang])}</span></label>`).join('')}
        </div></fieldset>
        <details class="issue-overview"><summary>${escape(t().clarification)}</summary><p>${escape(q.help.overview[state.lang])}</p><div class="reading-links">${readingLinks(q)}</div></details>
        <a class="explore-issue" href="${issueUrl(q)}" target="_blank" rel="noopener">${escape(t().explore)}</a>
        <details class="overlap-details"><summary>${escape(t().overlap)}</summary>${overlapTable(q)}</details>
      </article>`;
  }
  function progress() {
    const qs = questions();
    const answered = qs.filter(q => q.options.some(o => o.id === state.answers[q.id])).length;
    const skipped = qs.filter(q => data.skipped_choices.some(o => o.id === state.answers[q.id])).length;
    $('progress-label').textContent = `${answered} ${t().answered} · ${skipped} ${t().skipped} / ${qs.length}`;
    $('progress').max = qs.length;
    $('progress').value = answered + skipped;
    $('step-label').textContent=t().step.replace('{current}',state.currentIndex+1).replace('{total}',qs.length);
    $('back').disabled=state.currentIndex===0;
    const current=qs[state.currentIndex];
    const hasAnswer=[...current.options,...data.skipped_choices].some(o=>o.id===state.answers[current.id]);
    const last=state.currentIndex===qs.length-1;
    $('next').hidden=last; $('next').disabled=!hasAnswer;
    $('calculate').hidden=!last; $('calculate').disabled=!hasAnswer;
  }
  function renderResults() {
    const all = CompassScoring.score(data, state.answers, state.form, state.historical, state.questionIds, state.importance, state.estimates);
    all.sort(CompassScoring.compareResults);
    $('mode-note').textContent = t().currentNote + (state.estimates ? ' ' + t().estimateNote : '') + (state.historical ? ' ' + t().historyNote : '');
    if (!all[0]?.answered) {
      $('result-cards').innerHTML = `<p class="empty">${escape(t().empty)}</p>`;
      return;
    }
    $('result-cards').innerHTML = all.map(result => {
      const scoreLabel = result.matched === 0 ? t().noEvidenceScore : result.inferredCount ? t().estimatedScore : state.historical ? t().historicalConfirmedScore : t().confirmedScore;
      const score = `<div class="score confirmed">${percent(result.similarity)}<small>${escape(scoreLabel)}</small></div>`;
      return `<article class="result-card" data-party="${result.party.id}" data-score="${result.similarity}" data-coverage="${result.coverage}" data-documented="${result.documentedCoverage}">
        <div class="result-main"><div><h3>${escape(result.party[state.lang])}</h3><div class="result-meta">${result.matched} / ${result.answered} ${escape(t().matched)} · ${percent(result.documentedCoverage)} ${escape(t().coverage)}<br>${result.complete} ${escape(t().complete)}${result.historicalCount ? `<br>${result.historicalCount} ${escape(t().historyCount)}` : ''}</div></div>${score}</div>
        ${result.inferredCount ? `<p class="score-breakdown">${escape(t().documentedPart)}: ${percent(result.confirmedSimilarity)} · ${escape(t().estimatedPart)}: +${percent(result.inferredSimilarity)}</p>` : ''}
        <div class="score-track" aria-hidden="true"><span style="width:${result.similarity * 100}%"></span></div>
        ${result.matched===0 ? `<p class="evidence-gap">${escape(result.excludedCount ? t().excludedEvidence : t().noCoded)}${result.excludedCount ? ` <button class="include-history" type="button">${escape(t().includeEvidence)}</button>` : data.positions.some(p=>p.party_id===result.party.id && Object.keys(p.dimensions).length) ? ' '+escape(t().bankEvidence) : ''}</p>` : ''}
        <details><summary>${escape(t().inspect)}</summary><div class="evidence-list">
        ${result.items.map(item => {
          return `<div class="evidence"><h4>${item.question.id} · ${escape(item.question[state.lang])}</h4>
            <p class="values">${escape(t().user)}: ${escape(item.user[state.lang])}</p><p class="importance-value">${escape(t().importance)} ${escape(importanceLabel(item.question.id))}</p>
            <p class="question-match">${escape(t().questionScore)}: <strong>${percent(item.similarity)}</strong> · ${percent(item.documentedCoverage)} ${escape(t().coverage)}</p>
            ${item.components.map(c => {
              const p = c.evidence;
              const excluded = p && !c.known;
              return `<div class="component"><h5>${escape(c.dimension[state.lang])}</h5><p>${escape(t().user)}: ${escape(componentValue(c.dimension, c.userValue))}<br>${escape(t().party)}: ${escape(c.known ? CompassScoring.evidenceValues(p).map(value=>componentValue(c.dimension,value)).join(' / ') : excluded ? t().excluded : t().unknown)}</p>${c.known ? `<p class="component-match">${escape(t().componentScore)}: ${percent(c.similarity)}</p><p>${escape(p.values ? t().broadHint : c.dimension.similarity.rationale[state.lang])}</p>` : ''}${p ? `<span class="evidence-tag">${escape(t().statuses[p.status])}</span><p lang="${p.rationale_localized ? state.lang : 'en'}" dir="${p.rationale_localized && state.lang==='he' ? 'rtl' : 'ltr'}">${escape(p.rationale_localized?.[state.lang] || p.rationale)}</p>${p.status==='I' ? `<p class="inference-note">${escape(t().inferenceHint)}</p>` : ''}${p.source_ids.map(id => `<a href="${escape(data.sources[id].url)}" target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">${escape(data.sources[id].title)} (${escape(data.sources[id].date || 'undated')}) ↗</a>`).join('')}` : ''}</div>`;
            }).join('')}
          </div>`;
        }).join('')}
        </div></details>
      </article>`;
    }).join('');
  }
  function render() {
    cancelAnswerTransition();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'he' ? 'rtl' : 'ltr';
    document.title = `${t().title} · ${t().brand}`;
    const labels = { brand:'brand', eyebrow:'eyebrow', title:'title', subtitle:'subtitle', short:'short', long:'long', reset:'reset', back:'back', next:'next', 'quiz-tab':'quiz', 'results-tab':'results', calculate:'calculate', edit:'edit', 'skip-note':'skipNote', 'results-title':'resultTitle', 'results-subtitle':'resultSubtitle', 'coverage-note':'coverageNote', 'historical-label':'historical', 'estimates-label':'estimates', 'method-title':'method', 'method-body':'methodBody', footer:'footer' };
    Object.entries(labels).forEach(([id, key]) => $(id).textContent = t()[key]);
    $('topics').innerHTML=Object.values(t().domains).map(topic=>`<li>${escape(topic)}</li>`).join('');
    $('topics').setAttribute('aria-label',t().topicsLabel);
    $('language').value = state.lang;
    $('issues-link').href = issueUrl();
    $('issues-link').textContent = t().allIssues;
    $('date').textContent = `${t().checked}: ${data.checked_at}`;
    ['short', 'long'].forEach(form => $(form).setAttribute('aria-pressed', state.form === form));
    ['quiz', 'results'].forEach(view => { $(view).hidden = state.view !== view; $(`${view}-tab`).setAttribute('aria-pressed', state.view === view); });
    $('historical').checked = state.historical;
    $('estimates').checked = state.estimates;
    renderQuestions(); progress();
    if (state.view === 'results') renderResults();
  }
  function setView(view, scroll = true) {
    state.view = view; render();
    if (scroll) {
      document.querySelector('.tabs').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (view === 'results') $('results-title').focus({ preventScroll: true });
      else focusCurrentQuestion();
    }
  }
  $('questions').addEventListener('change', event => {
    if(answerTransition)return;
    if(event.target.classList.contains('importance-select')) {
      const id=event.target.dataset.question;
      const changeQuestion=event.target.value==='__replace';
      if(changeQuestion){
        event.target.value=String(questionImportance(id));
        replaceAutomatically(id);
        return;
      } else {
        state.importance[id] = Number(event.target.value);
      }
      $(`replace-${id}`).innerHTML=replacementHtml(data.questions.find(q=>q.id===id));
      return;
    }
    if(event.target.classList.contains('replacement-select')) {
      event.target.closest('.replacement').querySelector('button').disabled = !event.target.value;
      return;
    }
    if (event.target.type !== 'radio') return;
    confirmAnswer(event.target);
  });
  function startRun(form=state.form) {
    cancelAnswerTransition();
    state.form=form; state.optionOrders=createOptionOrders(); state.currentIndex=0; state.answers={}; state.importance={}; state.questionIds=CompassScoring.createRun(data,form); state.seen=new Set(state.questionIds);
  }
  $('language').addEventListener('change', event => { state.lang = event.target.value; render(); });
  ['short', 'long'].forEach(form => $(form).addEventListener('click', () => { if(state.form!==form){startRun(form);state.view='quiz';render();} }));
  $('reset').addEventListener('click', () => { startRun(); state.historical = false; state.estimates = true; setView('quiz'); });
  function replaceQuestion(oldId,newId) {
    const index=state.questionIds.indexOf(oldId);
    if(index<0||state.form!=='short'||!spareQuestions().some(q=>q.id===newId))return;
    state.questionIds[index]=newId; state.seen.add(newId);
    delete state.answers[oldId]; delete state.importance[oldId];
    renderQuestions(); progress();
    focusCurrentQuestion();
  }
  function replaceAutomatically(oldId) {
    const oldQuestion=data.questions.find(q=>q.id===oldId);
    const spare=spareQuestions();
    if(!oldQuestion||!spare.length)return;
    const sameDomain=spare.filter(q=>q.domain===oldQuestion.domain);
    const pool=sameDomain.length?sameDomain:spare;
    replaceQuestion(oldId,pool[Math.floor(Math.random()*pool.length)].id);
  }
  $('questions').addEventListener('click', event=>{
    const automatic=event.target.closest('.change-question');
    if(automatic){replaceAutomatically(automatic.dataset.question);return;}
    const manual=event.target.closest('.replace-question');
    if(manual)replaceQuestion(manual.dataset.question,$(`replacement-${manual.dataset.question}`).value);
  });
  $('questions').addEventListener('click',event=>{
    if(answerTransition){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  $('result-cards').addEventListener('click',event=>{if(event.target.closest('.include-history')){state.historical=true;$('historical').checked=true;renderResults();}});
  function helpOpen(wrap,open){wrap.querySelector('.issue-tooltip').hidden=!open;wrap.querySelector('button').setAttribute('aria-expanded',String(open));}
  $('questions').addEventListener('pointerover',event=>{const w=event.target.closest('.help-wrap');if(w&&!w.contains(event.relatedTarget))helpOpen(w,true);});
  $('questions').addEventListener('pointerout',event=>{const w=event.target.closest('.help-wrap');if(w&&!w.contains(event.relatedTarget)&&w.dataset.pinned!=='true'&&!w.contains(document.activeElement))helpOpen(w,false);});
  $('questions').addEventListener('focusin',event=>{const w=event.target.closest('.help-wrap');if(w)helpOpen(w,true);});
  $('questions').addEventListener('focusout',event=>{const w=event.target.closest('.help-wrap');if(w&&!w.contains(event.relatedTarget)&&w.dataset.pinned!=='true')helpOpen(w,false);});
  document.addEventListener('click',event=>{
    const button=event.target.closest('.help-button');
    document.querySelectorAll('.help-wrap').forEach(w=>{
      if(button&&w.contains(button)){const pinned=w.dataset.pinned!=='true';w.dataset.pinned=String(pinned);helpOpen(w,pinned);}
      else if(!w.contains(event.target)){w.dataset.pinned='false';helpOpen(w,false);}
    });
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.help-wrap').forEach(w=>{w.dataset.pinned='false';helpOpen(w,false);});});
  function focusCurrentQuestion() {
    document.querySelector('.question legend')?.focus({preventScroll:true});
    $('quiz').scrollIntoView({block:'start'});
  }
  function showQuestion(index) {
    state.currentIndex=Math.max(0,Math.min(index,state.questionIds.length-1));
    state.view='quiz';render();focusCurrentQuestion();
  }
  function advanceQuestion() {
    if(state.currentIndex<state.questionIds.length-1)showQuestion(state.currentIndex+1);
    else setView('results');
  }
  $('back').addEventListener('click',()=>showQuestion(state.currentIndex-1));
  $('next').addEventListener('click',advanceQuestion);
  $('calculate').addEventListener('click', () => setView('results'));
  $('results-tab').addEventListener('click', () => setView('results', false));
  $('quiz-tab').addEventListener('click', () => setView('quiz', false));
  $('edit').addEventListener('click', () => setView('quiz'));
  $('estimates').addEventListener('change', event => { state.estimates = event.target.checked; renderResults(); });
  $('historical').addEventListener('change', event => { state.historical = event.target.checked; renderResults(); });
  render();
})();
