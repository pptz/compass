(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('compass-data').textContent);
  const state = { lang: compassInitialLanguage(), form: 'short', optionOrders: createOptionOrders(), currentIndex: 0, answers: {}, importance: {}, view: 'quiz', historical: false, questionIds: CompassScoring.createRun(data,'short'), seen: new Set() };
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
    "subtitle": "Choose between concrete policy approaches. Each short run draws two questions per domain at random; the long run shuffles all twenty.",
    "short": "Short · 10 questions",
    "long": "Long · 20 questions",
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
    "resultSubtitle": "Confirmed agreement across the questions you answered, ranked from highest to lowest. Each party has its own percentage.",
    "historical": "Include historical / secondary evidence",
    "currentNote": "Unknown party positions earn no points. Full agreement on two of ten equally weighted questions gives 20%, even if the other eight positions are unknown. Your skipped questions are excluded.",
    "historyNote": "Historical research mode: these comparisons mix current evidence with older documents and secondary reports. They are not current-party rankings.",
    "coverage": "positions documented",
    "matched": "questions with some evidence",
    "historyCount": "historical / secondary components",
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
    "methodBody": "Each known policy component earns graded similarity credit from 0 to 100%. The question weight follows your chosen importance: more important questions influence the result more. The default is “important”. Its two components share that weight equally. We divide the weighted sum of confirmed credit by the total importance of ALL questions you answered, including unknown party positions. Unknowns earn no points; no agreement or disagreement is assumed. Skipped questions are excluded. With equal importance, two full matches and eight unknown positions give 20%. There is no additional domain weighting. Results sort by confirmed percentage, then documented share. The overlap tables are editorial estimates.",
    "footer": "Local research preview · answers stay in this page and disappear on reload. No analytics, account, or external requests. Source links open only when clicked. Source explanations are currently in English.",
    "domains": {
      "security": "Security & service",
      "institutions": "Democratic institutions",
      "religion": "Religion & state",
      "economy": "Economy & welfare",
      "services": "Education & public services"
    },
    "statuses": {
      "P": "Published policy",
      "S": "Attributable statement",
      "H": "Historical document",
      "R": "Secondary report",
      "U": "Unknown"
    },
    "explore": "Explore the issue and its open questions ↗",
    "allIssues": "Explore all the issues ↗",
    "further": "Further reading",
    "overlap": "How these approaches overlap",
    "overlapNote": "Editorial similarity estimates, not measured probabilities. Letters identify choices; they do not indicate a scale.",
    "componentScore": "Estimated component similarity",
    "questionScore": "Confirmed agreement on this question",
    "replace": "Use this question instead",
    "replacementPrompt": "Prefer a different topic? Choose an unused question.",
    "chooseReplacement": "Select a replacement…",
    "noSpare": "No unused questions remain in this run.",
    "excludedEvidence": "Dated or secondary evidence exists for these answers but is excluded by the current filter.",
    "includeEvidence": "Include dated / secondary sources",
    "noCoded": "No usable position is coded for these answered topics. The 0% means no confirmed agreement, not proven disagreement.",
    "bankEvidence": "Some positions are coded on other questions in the bank.",
    "coverageNote": "“Positions documented” is the share of your answered questions for which party positions are known, weighted by the importance you chose. Each question has two components; sometimes only one is documented. This measures available evidence, not agreement. Missing or excluded sources lower this percentage.",
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
    "step": "Question {current} of {total}"
  },
  "he": {
    "brand": "מצפן אידאולוגי",
    "eyebrow": "העמדות שלך. המדיניות המוצהרת.",
    "title": "הבחירה שלך - הקול שלך",
    "subtitle": "בחרו בין דרכי פעולה קונקרטיות. בכל סבב קצר נבחרות באקראי שתי שאלות מכל תחום; בסבב המלא מתערבב סדר כל עשרים השאלות.",
    "short": "קצר · 10 שאלות",
    "long": "מלא · 20 שאלות",
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
    "resultSubtitle": "התאמה מתועדת בכלל השאלות שעניתם עליהן, מהאחוז הגבוה לנמוך. לכל מפלגה אחוז עצמאי.",
    "historical": "הכללת מקורות היסטוריים ודיווחים משניים",
    "currentNote": "עמדות לא ידועות אינן מוסיפות נקודות. התאמה מלאה בשתי שאלות מתוך עשר בעלות משקל שווה נותנת 20%, גם אם שמונה העמדות האחרות חסרות. שאלות שדילגתם עליהן אינן נכללות.",
    "historyNote": "מצב מחקר היסטורי: ההשוואה משלבת מידע עדכני עם מסמכים ישנים ודיווחים משניים. זה אינו דירוג של עמדות המפלגות כיום.",
    "coverage": "עמדות מתועדות",
    "matched": "שאלות עם מידע חלקי לפחות",
    "historyCount": "מרכיבים ממקורות היסטוריים או משניים",
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
    "methodBody": "כל מרכיב מדיניות ידוע מקבל ניקוד דמיון מדורג מ־0 עד 100%. משקל השאלה נקבע לפי החשיבות שבחרתם: שאלות חשובות יותר משפיעות יותר על התוצאה. ברירת המחדל היא ״חשוב״. שני המרכיבים חולקים את המשקל שווה בשווה. מחלקים את סכום הניקוד המשוקלל בסכום החשיבות של כל השאלות שעניתם עליהן, כולל עמדות לא ידועות. מידע חסר אינו מוסיף נקודות, ואין הנחה של הסכמה או מחלוקת. דילוגים אינם נכללים. בחשיבות שווה, שתי התאמות מלאות ושמונה עמדות חסרות נותנות 20%. אין שקלול נוסף לפי תחום. התוצאות מסודרות לפי האחוז המתועד, ובשוויון לפי היקף המידע. טבלאות החפיפה הן אומדנים עריכתיים.",
    "footer": "תצוגת מחקר מקומית · התשובות נשארות בדף ונמחקות בטעינה מחדש. ללא חשבון, כלי מעקב או בקשות חיצוניות. קישורי המקורות נפתחים רק בלחיצה. הסברי המקורות מוצגים כעת באנגלית.",
    "domains": {
      "security": "ביטחון ושירות",
      "institutions": "מוסדות דמוקרטיים",
      "religion": "דת ומדינה",
      "economy": "כלכלה ורווחה",
      "services": "חינוך ושירותים ציבוריים"
    },
    "statuses": {
      "P": "מדיניות שפורסמה",
      "S": "הצהרה מיוחסת",
      "H": "מסמך היסטורי",
      "R": "דיווח משני",
      "U": "לא ידוע"
    },
    "explore": "להעמקה בסוגיה ובשאלות הפתוחות ↖",
    "allIssues": "להיכרות עם כל הסוגיות ↖",
    "further": "לקריאה נוספת",
    "overlap": "כיצד הגישות חופפות",
    "overlapNote": "אומדני דמיון עריכתיים, לא הסתברויות שנמדדו. האותיות מזהות חלופות ואינן סולם.",
    "componentScore": "אומדן הדמיון במרכיב",
    "questionScore": "התאמה מתועדת בשאלה הזו",
    "replace": "להחליף בשאלה הזו",
    "replacementPrompt": "מעדיפים נושא אחר? בחרו שאלה שטרם הוצגה.",
    "chooseReplacement": "בחירת שאלה חלופית…",
    "noSpare": "לא נותרו שאלות שלא הוצגו בסבב הזה.",
    "excludedEvidence": "קיימים מקורות מתוארכים או משניים לתשובות האלה, אך המסנן הנוכחי אינו כולל אותם.",
    "includeEvidence": "הכללת מקורות מתוארכים ומשניים",
    "noCoded": "לא קודדה עמדה מתאימה לנושאים שנענו. 0% פירושו שאין התאמה מתועדת, ולא שהוכחה מחלוקת.",
    "bankEvidence": "קיימות עמדות מקודדות בשאלות אחרות במאגר.",
    "coverageNote": "״עמדות מתועדות״ הוא החלק מהשאלות שעניתם עליהן שלגביו ידועה עמדת המפלגה, בשקלול החשיבות שבחרתם. לכל שאלה שני מרכיבים, ולעיתים רק אחד מתועד. זהו מדד להיקף המידע, ולא להתאמה. מקורות חסרים או מוחרגים מורידים את האחוז הזה.",
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
    "step": "שאלה {current} מתוך {total}"
  },
  "ru": {
    "brand": "Идеологический Компас",
    "eyebrow": "Ваши взгляды. Публичные позиции.",
    "title": "Ваш Выбор — Ваш Голос",
    "subtitle": "Выбирайте конкретные политические подходы к различным темам.\nКороткий опрос случайно выбирает по два вопроса из каждой темы; полный перемешивает все двадцать.",
    "short": "Короткий · 10 вопросов",
    "long": "Полный · 20 вопросов",
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
    "resultSubtitle": "Подтверждённое совпадение по всем вопросам, на которые вы ответили: от большего процента к меньшему. Проценты партий независимы.",
    "historical": "Включить старые программы и вторичные сообщения",
    "currentNote": "Неизвестные позиции партии не добавляют баллов. Полное совпадение по двум из десяти равновесных вопросов даёт 20%, даже если остальные восемь позиций неизвестны. Ваши пропуски не учитываются.",
    "historyNote": "Исторический режим: сравнение сочетает текущие сведения со старыми документами и вторичными сообщениями. Это не рейтинг нынешних позиций партий.",
    "coverage": "данных о позиции",
    "matched": "вопросов хотя бы с частичными данными",
    "historyCount": "исторических / вторичных компонентов",
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
    "methodBody": "Каждый известный компонент позиции получает от 0 до 100% сходства по таблице. Вес вопроса зависит от выбранной вами важности: более важные вопросы сильнее влияют на результат. По умолчанию выбрано «Важно». Два компонента делят этот вес поровну. Сумму подтверждённых совпадений с учётом весов делим на суммарную важность ВСЕХ отвеченных вопросов, включая неизвестные позиции партии. Неизвестные позиции баллов не добавляют; мы не предполагаем ни согласия, ни несогласия. Ваши пропуски исключаются. При одинаковой важности два полных совпадения и восемь неизвестных позиций дают 20%. Дополнительных весов по темам нет. Сортировка идёт по подтверждённому проценту; при равенстве — по полноте данных. Таблицы сходства — редакционные оценки.",
    "footer": "Локальная исследовательская версия · ответы остаются на странице и исчезают при перезагрузке. Без аккаунта и аналитики. Внешние ссылки открываются только по нажатию. Примечания к партийным источникам пока на английском; язык внешнего материала указан у ссылки.",
    "domains": {
      "security": "Безопасность и служба",
      "institutions": "Демократические институты",
      "religion": "Религия и государство",
      "economy": "Экономика и социальная поддержка",
      "services": "Образование и общественные услуги"
    },
    "statuses": {
      "P": "Опубликованная политика",
      "S": "Атрибутированное заявление",
      "H": "Исторический документ",
      "R": "Вторичное сообщение",
      "U": "Неизвестно"
    },
    "explore": "Подробнее о проблеме и открытых вопросах ↗",
    "allIssues": "Обзор всех тем ↗",
    "further": "Дополнительное чтение",
    "overlap": "Насколько близки эти подходы",
    "overlapNote": "Редакционные оценки сходства, не измеренные вероятности. Буквы обозначают варианты, а не шкалу.",
    "componentScore": "Оценка сходства компонента",
    "questionScore": "Подтверждённое совпадение по вопросу",
    "replace": "Заменить этим вопросом",
    "replacementPrompt": "Предпочитаете другую тему? Выберите ещё не показанный вопрос.",
    "chooseReplacement": "Выберите замену…",
    "noSpare": "В этом запуске не осталось неиспользованных вопросов.",
    "excludedEvidence": "Для этих ответов есть старые или вторичные источники, но текущий фильтр их исключает.",
    "includeEvidence": "Включить старые / вторичные источники",
    "noCoded": "Для этих тем подходящая позиция не закодирована. 0% означает отсутствие подтверждённых совпадений, а не доказанное расхождение.",
    "bankEvidence": "Некоторые позиции закодированы для других вопросов банка.",
    "coverageNote": "«Данные о позиции» — доля ваших отвеченных вопросов, для которой известны позиции партии, с учётом выбранной вами важности. У каждого вопроса два компонента; иногда известен только один. Это полнота сведений, а не совпадение взглядов. Отсутствующие или исключённые фильтром источники снижают этот показатель.",
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
    "step": "Вопрос {current} из {total}"
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
    const all = CompassScoring.score(data, state.answers, state.form, state.historical, state.questionIds, state.importance);
    all.sort(CompassScoring.compareResults);
    $('mode-note').textContent = t().currentNote + (state.historical ? ' ' + t().historyNote : '');
    if (!all[0]?.answered) {
      $('result-cards').innerHTML = `<p class="empty">${escape(t().empty)}</p>`;
      return;
    }
    $('result-cards').innerHTML = all.map(result => {
      const scoreLabel = result.matched === 0 ? t().noEvidenceScore : state.historical ? t().historicalConfirmedScore : t().confirmedScore;
      const score = `<div class="score confirmed">${percent(result.similarity)}<small>${escape(scoreLabel)}</small></div>`;
      return `<article class="result-card" data-party="${result.party.id}" data-score="${result.similarity}" data-coverage="${result.coverage}">
        <div class="result-main"><div><h3>${escape(result.party[state.lang])}</h3><div class="result-meta">${result.matched} / ${result.answered} ${escape(t().matched)} · ${percent(result.coverage)} ${escape(t().coverage)}<br>${result.complete} ${escape(t().complete)}${result.historicalCount ? `<br>${result.historicalCount} ${escape(t().historyCount)}` : ''}</div></div>${score}</div>
        <div class="score-track" aria-hidden="true"><span style="width:${result.similarity * 100}%"></span></div>
        ${result.matched===0 ? `<p class="evidence-gap">${escape(result.excludedCount ? t().excludedEvidence : t().noCoded)}${result.excludedCount ? ` <button class="include-history" type="button">${escape(t().includeEvidence)}</button>` : data.positions.some(p=>p.party_id===result.party.id && Object.keys(p.dimensions).length) ? ' '+escape(t().bankEvidence) : ''}</p>` : ''}
        <details><summary>${escape(t().inspect)}</summary><div class="evidence-list">
        ${result.items.map(item => {
          return `<div class="evidence"><h4>${item.question.id} · ${escape(item.question[state.lang])}</h4>
            <p class="values">${escape(t().user)}: ${escape(item.user[state.lang])}</p><p class="importance-value">${escape(t().importance)} ${escape(importanceLabel(item.question.id))}</p>
            <p class="question-match">${escape(t().questionScore)}: <strong>${percent(item.similarity)}</strong> · ${percent(item.coverage)} ${escape(t().coverage)}</p>
            ${item.components.map(c => {
              const p = c.evidence;
              const excluded = p && ['H', 'R'].includes(p.status) && !state.historical;
              return `<div class="component"><h5>${escape(c.dimension[state.lang])}</h5><p>${escape(t().user)}: ${escape(componentValue(c.dimension, c.userValue))}<br>${escape(t().party)}: ${escape(c.known ? componentValue(c.dimension, p.value) : excluded ? t().excluded : t().unknown)}</p>${c.known ? `<p class="component-match">${escape(t().componentScore)}: ${percent(c.similarity)}</p><p>${escape(c.dimension.similarity.rationale[state.lang])}</p>` : ''}${p ? `<span class="evidence-tag">${escape(t().statuses[p.status])}</span><p lang="en" dir="ltr">${escape(p.rationale)}</p>${p.source_ids.map(id => `<a href="${escape(data.sources[id].url)}" target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">${escape(data.sources[id].title)} (${escape(data.sources[id].date || 'undated')}) ↗</a>`).join('')}` : ''}</div>`;
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
    const labels = { brand:'brand', eyebrow:'eyebrow', title:'title', subtitle:'subtitle', short:'short', long:'long', reset:'reset', back:'back', next:'next', 'quiz-tab':'quiz', 'results-tab':'results', calculate:'calculate', edit:'edit', 'skip-note':'skipNote', 'results-title':'resultTitle', 'results-subtitle':'resultSubtitle', 'coverage-note':'coverageNote', 'historical-label':'historical', 'method-title':'method', 'method-body':'methodBody', footer:'footer' };
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
  $('reset').addEventListener('click', () => { startRun(); state.historical = false; setView('quiz'); });
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
  $('historical').addEventListener('change', event => { state.historical = event.target.checked; renderResults(); });
  render();
})();
