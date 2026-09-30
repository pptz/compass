# Your Choice — Your Vote — policy choices, sources and reasoned estimates (v0.5)

The browser contains **22 original questions, 100 substantive choices and 44 policy components**, in English, Hebrew and Russian. Each question offers at most five substantive answers. [Open the quiz](index.html) or [read the issue guide](issues.html). Each guide section introduces the dispute, presents competing approaches, poses open questions and links to further reading. The question-mark help and “About this issue” elements explain the issue itself; calculation details are separate.

[Zehut's compass](https://zehut.org.il/compass), inspected on 29 September 2026, informed the policy-choice format. These are newly authored questions; neither its question bank nor its party-specific weights are reused.

## Question selection

The quiz shows one question per step. A substantive answer, Skip or None receives a brief visual confirmation before advancing to the next question; the last choice opens results. Back restores earlier answers and importance; Next continues after an importance-only edit or when retaining a saved answer. Language changes preserve the current step. Replacement keeps the same step number, and restarting resets to step one.

Every new short run draws **one question from each of six domains and a second question from four randomly selected domains**, then shuffles all ten. Every domain appears, with an equal chance of receiving the extra question; exact equality within ten questions is impossible with six domains. The long run shuffles all 22. The Status of Women domain contains Q21 (party representation) and Q22 (social equality and gender separation). Substantive answer choices are also shuffled once per run; revisiting a question or switching language preserves their order and answer IDs. Overlap tables use the same displayed order. Switching language preserves the run and answers; starting again creates a new run.

Importance appears immediately beneath the question text, before the answer options. **Change question** immediately draws an unused question, preferring a random question from the same domain when possible. The importance menu offers the same action. **Skip** is a separate unscored choice that retains the question in the run and moves forward, as does “None of these fits”. Back allows either choice to be revised. Selecting “Not important” additionally offers a manual replacement chooser.

Replaced questions stay retired for that run; after twelve replacements in a short run there are no spares. The long form starts with all 22 questions, so it has no spares. The change action is disabled with an explanation when no unused questions remain; Skip remains available. Other answers and importance choices are preserved, and the replacement starts with default importance. Scores use the actual selected questions, including replacements.

## Scoring and evidence

Each answer has two independently scored components. Importance is the only question multiplier: Critical = 1, Important = 0.8 (default), Not very important = 0.5, Not important = 0.1. The interface shows verbal importance labels. Each component receives half the question weight.

Specific party positions use the graded overlap matrices in [similarity-rules.json](similarity-rules.json). Related policies can partially match. Broad positions instead contain an explicit set of compatible values (`values`): each included alternative matches fully and alternatives outside the set receive zero. These sets express a shared policy direction, not uncertainty that the party endorses every detailed package.

For example, Balad's secular orientation supports an **inference** in favor of allowing Shabbat transport. `service = [limited, full]` matches both kinds of operating service equally and matches `none` at zero. The decision-making authority remains unknown. No national/local preference or timetable is invented. At the default inference factor of 0.6, this one known direction contributes 30% of the two-component question, not 100%. This is an editorial discount, not a measured probability.

Evidence categories:

- **P**: published party policy; included by default.
- **S**: attributable statement; included by default.
- **R**: reviewed secondary report or institutional party profile; now included by default. Undated profiles are identified as such, not called new election manifestos.
- **H**: historical source; included only with the historical switch.
- **I**: source-linked editorial inference, with a multilingual explanation. Included by default, discounted to 60%, and independently switchable. It does not increase documented coverage.
- **U**: unknown; contributes no credit but stays in the denominator.

A documented position takes precedence over an inference. Where an archived position has a separate inference fallback, the fallback can be used with archives off; switching archives on uses the historical position, without adding or averaging both. Corroborating entries and superseded evidence remain in the dataset for review; they are not double counted.

```
question_weight = selected_importance
component_weight = question_weight / 2
specific_similarity = matrix[user_value][party_value]
broad_similarity = 1 if user_value in compatible_values else 0
D = sum(question_weight for ALL substantive answered questions)

sourced_score = sum(component_weight * similarity for enabled P/S/R/H) / D
inferred_score = sum(component_weight * similarity * 0.6 for enabled I) / D
result = 100 * (sourced_score + inferred_score)
documented_share = 100 * sum(component_weight for enabled P/S/R/H) / D
```

Skipped and replaced questions do not contribute. Unanswered questions do not contribute. Remaining unknown party components stay in the denominator; two complete sourced matches and eight unknowns still give 20% at equal importance. No missing position is filled by the user's own answer, another party's answer, religion, ethnicity or coalition membership alone. Each party has an independent score; the best result is not normalized to 100%.

The result cards separate sourced and inferred contributions. Their documented percentage excludes all inferences. Total similarity can therefore exceed documented coverage, but cannot exceed documented coverage plus the discounted inferred component weight. With estimates off, it cannot exceed documented coverage. Sort by total similarity, then documented coverage, then total supported component weight and party ID.

The coefficient 0.6 and the graded matrices are editorial conventions, not statistically calibrated confidence measures. Historical sources and secondary-source dates remain visible. A report of one lawmaker's view is not automatically generalized to every party or every issue. Policy gaps and intra-party disagreements still require research.

## Source coverage and limitations

The [Status of Women review](women-review.md) documents the two added questions and their evidence, including the distinction between exclusion and quotas. The source-linked key is [compass-data.json](compass-data.json); [party-positions.csv](party-positions.csv) exports coarse values and inference metadata. [research-expansion.json](research-expansion.json) contains the earlier additional source review, with [a readable review table](research-expansion.md). The latest [targeted coverage review](coverage-review.md), including Arabic-language sources, records additions, replacements and withdrawn mappings from [coverage-review.json](coverage-review.json). [source-gaps.md](source-gaps.md) lists sourced components, inferences and remaining gaps separately. The [Yashar programme review](yashar-review.md) records the initial official-programme mapping across all 20 questions.

This expansion draws on Israel Democracy Institute party profiles, Times of Israel reporting, Associated Press coverage, and historical Ynet reports. Sources document particular policy components rather than entire answer packages. Dated profiles and secondary reports are not substitutes for a comprehensive current manifesto. The earlier source investigation remains in [the archive](archive/agreement-scale-v1/compass-research.md); its old scoring rules are superseded.

## Questions and policy packages

Stable IDs below identify topics, not their order in a run. All questions can appear in a short run. The two components beneath each question are its scoring dimensions.

### Q1 · What political framework should Israel pursue with the Palestinians?
**איזו מסגרת מדינית על ישראל לקדם ביחס לפלסטינים?**
- **A.** Negotiate two states with enforceable security safeguards and agreed borders.

  לנהל משא ומתן לשתי מדינות, עם הסדרי ביטחון ניתנים לאכיפה וגבולות מוסכמים.
- **B.** Pursue a Palestinian state only within a wider regional agreement with Arab states and security guarantees.

  לקדם מדינה פלסטינית רק כחלק מהסדר אזורי רחב עם מדינות ערב וערבויות ביטחוניות.
- **C.** Maintain Israeli security control and Palestinian civil autonomy, without a separate Palestinian state.

  לקיים שליטה ביטחונית ישראלית ואוטונומיה אזרחית פלסטינית, ללא מדינה פלסטינית נפרדת.
- **D.** Defer the final-status decision and pursue practical interim agreements on security, movement and economic life.

  לדחות את ההכרעה על הסדר הקבע ולקדם הסכמי ביניים בנושאי ביטחון, תנועה וכלכלה.
- **E.** Work toward one democratic state with equal citizenship for Israelis and Palestinians, rather than two states.

  לפעול למדינה דמוקרטית אחת עם אזרחות שווה לישראלים ולפלסטינים, במקום שתי מדינות.

Components: A separate Palestinian state / Political framework.

| Choice | A separate Palestinian state | Political framework |
|---|---|---|
| A | Pursue a state with security conditions | Bilateral negotiated agreement |
| B | Pursue a state with security conditions | Regional agreement |
| C | No separate Palestinian state | Autonomy under Israeli security control |
| D | Defer the final-status decision | Interim arrangements |
| E | No separate Palestinian state | One shared democratic state |

### Q2 · How should military and civilian service be organized, including for yeshiva students?
**כיצד יש להסדיר שירות צבאי ואזרחי, כולל לתלמידי ישיבות?**
- **A.** Require service from everyone, with the army choosing whom it needs and civilian service for the rest; allow only narrow individual exceptions.

  לחייב את כולם בשירות: הצבא יבחר את מי שנחוץ לו, והשאר ישרתו בשירות אזרחי; לאפשר רק חריגים אישיים מצומצמים.
- **B.** Require a contribution from everyone, but let each person choose between military service and an equally recognized civilian route.

  לחייב את כולם בתרומה, אך לאפשר לכל אדם לבחור בין שירות צבאי למסלול אזרחי בעל מעמד שווה.
- **C.** Keep compulsory military service, while exempting full-time yeshiva students and offering adapted service to those who leave study.

  להשאיר שירות צבאי חובה, לפטור תלמידי ישיבות הלומדים במשרה מלאה ולהציע שירות מותאם למי שעוזבים את הלימודים.
- **D.** Move to a paid professional military and voluntary civilian service, ending compulsory service for everyone.

  לעבור לצבא מקצועי בשכר ולשירות אזרחי מרצון, ולבטל את חובת השירות לכולם.

Components: Who is obliged to serve? / Service pathway.

| Choice | Who is obliged to serve? | Service pathway |
|---|---|---|
| A | Universal obligation with narrow individual exceptions | Military service takes priority |
| B | Universal obligation with narrow individual exceptions | Equal choice of military or civilian service |
| C | Exemption for full-time yeshiva study | Military service takes priority |
| D | Voluntary service for everyone | Equal choice of military or civilian service |

### Q3 · How should power be divided between the Knesset and the judiciary?
**כיצד יש לחלק את הכוח בין הכנסת למערכת המשפט?**
- **A.** Keep rights-based judicial review without an ordinary-majority override; use a professionally led judicial appointments committee.

  לשמור על ביקורת שיפוטית להגנת זכויות ללא התגברות ברוב רגיל; למנות שופטים בוועדה בהובלה מקצועית.
- **B.** Require government–opposition agreement on judicial appointments, and prohibit overriding rights judgments by an ordinary coalition majority.

  לחייב הסכמה בין קואליציה לאופוזיציה במינוי שופטים, ולא לאפשר לרוב קואליציוני רגיל להתגבר על פסיקות המגינות על זכויות.
- **C.** Let an ordinary Knesset majority override invalidation of a law and give elected legislators control over judicial appointments.

  לאפשר לרוב רגיל בכנסת להתגבר על פסילת חוק ולהעניק לנבחרי הציבור שליטה במינוי שופטים.
- **D.** Allow an ordinary-majority override, but have the public elect senior judges directly for fixed terms.

  לאפשר התגברות ברוב רגיל, אך לבחור שופטים בכירים בבחירה ישירה של הציבור לתקופות קצובות.

Components: Override by an ordinary coalition majority / Who selects judges?.

| Choice | Override by an ordinary coalition majority | Who selects judges? |
|---|---|---|
| A | No | Professional committee |
| B | No | Government–opposition agreement |
| C | Yes | Parliamentary majority |
| D | Yes | Direct public election |

### Q4 · How should equality and the state's national identity be expressed in constitutional law?
**כיצד יש לבטא את השוויון ואת הזהות הלאומית של המדינה בחוקי היסוד?**
- **A.** Guarantee equal individual civil rights in a Basic Law while retaining Israel's identity as a Jewish and democratic state.

  לעגן בחוק יסוד שוויון זכויות אזרחיות אישיות, לצד זהותה של ישראל כמדינה יהודית ודמוקרטית.
- **B.** Guarantee constitutional equality and define the state in civic terms as belonging equally to all its citizens.

  לעגן שוויון חוקתי ולהגדיר את המדינה במונחים אזרחיים כשייכת באופן שווה לכל אזרחיה.
- **C.** Guarantee equal individual rights and recognize both Jewish and Arab national collectives in the constitutional framework.

  לעגן שוויון זכויות אישיות ולהכיר במסגרת החוקתית הן בקולקטיב הלאומי היהודי והן בקולקטיב הלאומי הערבי.
- **D.** Retain the Jewish and democratic constitutional definition, and protect equality through ordinary legislation.

  להשאיר את ההגדרה החוקתית היהודית והדמוקרטית ולהגן על השוויון בחקיקה רגילה.
- **E.** Keep the Jewish and democratic definition and existing rights protections, without adding a new equality guarantee.

  להשאיר את ההגדרה היהודית והדמוקרטית ואת הגנות הזכויות הקיימות, ללא עיגון חדש של השוויון.

Components: Legal protection for equal civil rights / National identity.

| Choice | Legal protection for equal civil rights | National identity |
|---|---|---|
| A | Explicit constitutional guarantee | Jewish and democratic |
| B | Explicit constitutional guarantee | Civic state of all citizens |
| C | Explicit constitutional guarantee | Recognition of two national collectives |
| D | Ordinary legislation | Jewish and democratic |
| E | Retain existing protections | Jewish and democratic |

### Q5 · What routes should couples have for marriage, partnership and separation?
**אילו מסלולים יש להציע לזוגות לנישואים, לזוגיות ולפרידה?**
- **A.** Offer civil marriage and divorce alongside an optional, legally recognized religious route.

  להציע נישואים וגירושים אזרחיים לצד מסלול דתי מוכר לבחירת הזוג.
- **B.** Use civil marriage and divorce for everyone legally; religious ceremonies remain a private choice.

  להסדיר את הנישואים והגירושים של כולם במערכת אזרחית; טקס דתי יישאר בחירה פרטית.
- **C.** Add civil partnership registration with legal protections, while retaining religious marriage as a separate recognized route.

  להוסיף רישום זוגיות אזרחית עם הגנות משפטיות, לצד נישואים דתיים כמסלול מוכר נפרד.
- **D.** Keep marriage and divorce under the religious institutions, without adding a domestic civil route.

  להשאיר את הנישואים והגירושים בסמכות מוסדות הדת, ללא הוספת מסלול אזרחי בישראל.

Components: Civil legal route / Role of religious institutions.

| Choice | Civil legal route | Role of religious institutions |
|---|---|---|
| A | Civil marriage and divorce for all | Optional legally recognized religious route |
| B | Civil marriage and divorce for all | Religious ceremonies are private |
| C | Civil partnership registration | Optional legally recognized religious route |
| D | No domestic civil route | Religious institutions have exclusive jurisdiction |

### Q6 · Who should decide on Shabbat transport, and what service should be available?
**מי צריך להחליט על תחבורה בשבת, ואיזה שירות צריך להיות זמין?**
- **A.** Let municipalities run limited routes suited to local needs and avoid routes through religious neighborhoods.

  לאפשר לרשויות להפעיל קווים מצומצמים לפי הצורך המקומי, תוך הימנעות ממעבר בשכונות דתיות.
- **B.** Set a national limited network connecting hospitals, employment centers and major towns, with uniform rules.

  לקבוע רשת ארצית מצומצמת המחברת בתי חולים, מוקדי תעסוקה ויישובים מרכזיים, לפי כללים אחידים.
- **C.** Operate a regular national public transport network on Shabbat, with service frequency adjusted to demand.

  להפעיל בשבת רשת תחבורה ציבורית ארצית רגילה, בתדירות המותאמת לביקוש.
- **D.** Keep public transport closed, but let municipalities authorize privately funded shared transport.

  להשאיר את התחבורה הציבורית סגורה, אך לאפשר לרשויות להתיר תחבורה שיתופית במימון פרטי.
- **E.** Maintain a national rest-day policy without public transport; keep exceptions under national rules.

  לקיים מדיניות יום מנוחה ארצית ללא תחבורה ציבורית, עם חריגים לפי כללים ארציים.

Components: Public transport on Shabbat / Decision-making level.

| Choice | Public transport on Shabbat | Decision-making level |
|---|---|---|
| A | Limited public service | Municipalities |
| B | Limited public service | National government |
| C | Regular public network | National government |
| D | No public service | Municipalities |
| E | No public service | National government |

### Q7 · What fiscal approach should guide healthcare, education and welfare?
**איזו מדיניות תקציבית צריכה להנחות את הבריאות, החינוך והרווחה?**
- **A.** Expand public services, financed mainly by higher taxes on high incomes and wealth.

  להרחיב שירותים ציבוריים, בעיקר באמצעות הגדלת המס על הכנסות גבוהות ועל הון.
- **B.** Expand universal services and finance them through broader tax increases shared across the population.

  להרחיב שירותים אוניברסליים ולממן אותם בהעלאות מס רחבות המתחלקות על פני האוכלוסייה.
- **C.** Expand services by cutting other spending and improving efficiency, without planning a tax increase.

  להרחיב שירותים באמצעות קיצוץ הוצאות אחרות והתייעלות, ללא העלאת מס מתוכננת.
- **D.** Keep the present scale of public services and concentrate on efficiency and reallocating existing budgets.

  לשמר את היקף השירותים הציבוריים ולהתמקד בהתייעלות ובחלוקה מחדש של התקציבים הקיימים.
- **E.** Reduce taxes and state provision, with a larger role for private insurance, households and community support.

  להפחית מסים ואת היקף השירות המדינתי, ולהרחיב את תפקיד הביטוח הפרטי, משקי הבית והסיוע הקהילתי.

Components: Scale of publicly funded services / Main funding approach.

| Choice | Scale of publicly funded services | Main funding approach |
|---|---|---|
| A | Expand | Higher taxes on high incomes and wealth |
| B | Expand | Broader tax increases |
| C | Expand | Reallocate existing spending |
| D | Maintain | Reallocate existing spending |
| E | Reduce state provision | Lower taxes and private provision |

### Q8 · Which mix of tools should address the cost of everyday goods?
**באיזה שילוב כלים יש לטפל ביוקר המוצרים היומיומיים?**
- **A.** Reduce import barriers broadly and enforce competition rules, while retaining product-safety standards.

  לצמצם חסמי יבוא באופן רחב ולאכוף תחרות, תוך שמירה על תקני בטיחות למוצרים.
- **B.** Open more markets to imports, protect strategic local production, and fight domestic concentration.

  לפתוח שווקים נוספים ליבוא, להגן על ייצור מקומי אסטרטגי ולהיאבק בריכוזיות המקומית.
- **C.** Retain broad protection for local producers and use price controls on essential goods.

  לשמור על הגנה רחבה ליצרנים מקומיים ולהפעיל פיקוח מחירים על מוצרי יסוד.
- **D.** Open imports broadly, but cushion living costs mainly through targeted support for low-income households.

  לפתוח את היבוא באופן רחב, אך להקל על יוקר המחיה בעיקר בסיוע ממוקד למשקי בית מעוטי הכנסה.
- **E.** Keep protection for strategic production and use targeted household support to offset higher living costs.

  להשאיר הגנה על ייצור אסטרטגי ולפצות על יוקר המחיה באמצעות סיוע ממוקד למשקי בית.

Components: Import policy / Main consumer policy tool.

| Choice | Import policy | Main consumer policy tool |
|---|---|---|
| A | Broadly reduce import barriers | Competition and antitrust enforcement |
| B | Selective opening with strategic protection | Competition and antitrust enforcement |
| C | Retain broad import protection | Price controls |
| D | Broadly reduce import barriers | Targeted household support |
| E | Selective opening with strategic protection | Targeted household support |

### Q9 · School curriculum: what common core should be compulsory, and in which schools?
**תוכנית הלימודים: איזו ליבה משותפת צריכה להיות חובה, ובאילו בתי ספר?**
- **A.** Fund state education streams with a common core curriculum, while allowing cultural and religious content alongside it.

  לממן זרמי חינוך ממלכתיים עם ליבה משותפת, לצד תכנים תרבותיים ודתיים.
- **B.** Fund both state and independent schools, but make core studies a condition of public funding.

  לממן בתי ספר ממלכתיים ועצמאיים, אך להתנות מימון ציבורי בלימודי ליבה.
- **C.** Fund state and independent religious or community schools without making the common core a funding condition.

  לממן בתי ספר ממלכתיים וקהילתיים או דתיים עצמאיים, בלי להתנות את המימון בליבה משותפת.
- **D.** Let parents direct funding through vouchers, without a common-core condition imposed by the state.

  לאפשר להורים לכוון את המימון בשוברים, בלי שהמדינה תתנה אותו בליבה משותפת.
- **E.** Require every school (state, private and religious) to teach a common core, regardless of funding. Allow additional subjects and public funding for both state and independent schools.

  לחייב כל בית ספר (ממלכתי, פרטי ודתי) ללמד ליבה משותפת, ללא תלות במקור המימון. לאפשר מקצועות נוספים ומימון ציבורי לבתי ספר ממלכתיים ועצמאיים.

Components: Scope of the common-core requirement / School funding and governance.

| Choice | Scope of the common-core requirement | School funding and governance |
|---|---|---|
| A | Required for public funding | Publicly funded state streams only |
| B | Required for public funding | State and independent schools |
| C | Not a condition of public funding | State and independent schools |
| D | Not a condition of public funding | Parent-directed vouchers |
| E | Required in every school, regardless of funding | State and independent schools |

### Q10 · How should serious organized crime and protection rackets be tackled?
**כיצד יש להתמודד עם פשיעה מאורגנת חמורה וגביית דמי חסות?**
- **A.** Strengthen police investigations, financial enforcement and prosecution; keep the Shin Bet focused on security threats.

  לחזק חקירות משטרה, אכיפה כלכלית ופרקליטות; להשאיר את השב״כ ממוקד באיומים ביטחוניים.
- **B.** Keep the police in charge, with a legally defined Shin Bet intelligence role in serious organized crime and judicial oversight.

  להשאיר את ההובלה במשטרה, עם תפקיד מודיעיני מוגדר בחוק לשב״כ בפשיעה מאורגנת חמורה ובפיקוח שיפוטי.
- **C.** Give security services the lead against serious protection rackets, including cases not already linked to terrorism.

  להעניק לשירותי הביטחון הובלה במאבק בגביית דמי חסות חמורה, גם במקרים שטרם נקשרו לטרור.
- **D.** Build locally accountable policing and prevention services, supported by national investigators, without a Shin Bet role.

  לבנות שיטור ושירותי מניעה באחריות מקומית ובסיוע חוקרים ארציים, ללא תפקיד לשב״כ.

Components: Shin Bet role beyond terrorism / Institutional lead.

| Choice | Shin Bet role beyond terrorism | Institutional lead |
|---|---|---|
| A | No | National police and prosecution |
| B | Yes | National police and prosecution |
| C | Yes | Security-service leadership |
| D | No | Locally accountable policing |

### Q11 · What territorial policy should Israel pursue in the West Bank / Judea and Samaria?
**איזו מדיניות טריטוריאלית על ישראל לקדם ביהודה ושומרון / הגדה המערבית?**
- **A.** Extend sovereignty unilaterally to selected areas, while leaving other areas outside Israeli sovereignty.

  להחיל ריבונות באופן חד־צדדי על אזורים נבחרים, ולהשאיר אזורים אחרים מחוץ לריבונות ישראל.
- **B.** Extend Israeli sovereignty to the entire territory.

  להחיל ריבונות ישראלית על השטח כולו.
- **C.** Make territorial changes only through a negotiated agreement with agreed borders.

  לבצע שינויים טריטוריאליים רק במסגרת הסכם וגבולות מוסכמים.
- **D.** Avoid annexation or withdrawal for now; maintain security control while deferring final borders.

  להימנע כעת מסיפוח ומנסיגה, ולשמר שליטה ביטחונית תוך דחיית ההכרעה על גבולות הקבע.
- **E.** Withdraw unilaterally from selected areas and settlements to reduce permanent involvement, without waiting for an agreement.

  לסגת באופן חד־צדדי מאזורים ומיישובים נבחרים כדי לצמצם מעורבות קבועה, בלי להמתין להסכם.

Components: Unilateral extension of sovereignty / Territorial approach.

| Choice | Unilateral extension of sovereignty | Territorial approach |
|---|---|---|
| A | Yes | Annex selected areas |
| B | Yes | Annex the whole territory |
| C | No | Negotiated borders |
| D | No | No final border change for now |
| E | No | Unilateral withdrawal |

### Q12 · What should the long-term arrangement in Gaza be?
**מה צריך להיות ההסדר ארוך הטווח ברצועת עזה?**
- **A.** Establish Israeli civilian settlements and long-term Israeli civil administration.

  להקים יישובים אזרחיים ישראליים ומנהל אזרחי ישראלי ארוך טווח.
- **B.** Maintain long-term Israeli administration for security and reconstruction, without civilian settlements.

  לקיים מנהל ישראלי ארוך טווח לצורכי ביטחון ושיקום, ללא יישובים אזרחיים.
- **C.** Establish Palestinian civil administration with enforceable security arrangements and no Israeli civilian settlements.

  להקים מנהל אזרחי פלסטיני עם הסדרי ביטחון ניתנים לאכיפה וללא יישובים אזרחיים ישראליים.
- **D.** Seek an international or regional administration for reconstruction and governance, without Israeli civilian settlements.

  לפעול למנהל בינלאומי או אזורי לשיקום ולניהול אזרחי, ללא יישובים אזרחיים ישראליים.

Components: Israeli civilian settlements / Civil administration.

| Choice | Israeli civilian settlements | Civil administration |
|---|---|---|
| A | Yes | Israeli administration |
| B | No | Israeli administration |
| C | No | Palestinian administration |
| D | No | International or regional administration |

### Q13 · What kind of inquiry should investigate the October 7 failures?
**איזה סוג של חקירה צריך לבדוק את מחדלי 7 באוקטובר?**
- **A.** Use a state commission of inquiry whose members are appointed by the president of the Supreme Court.

  להקים ועדת חקירה ממלכתית שחבריה מתמנים בידי נשיא בית המשפט העליון.
- **B.** Create a statutory independent commission under a new appointment arrangement agreed by government and opposition.

  להקים ועדה עצמאית מכוח חוק, לפי הסדר מינוי חדש שיוסכם בין קואליציה לאופוזיציה.
- **C.** Use a government-appointed inquiry with professional investigators and a publicly defined mandate.

  לקיים בדיקה במינוי הממשלה, עם חוקרים מקצועיים ומנדט שיפורסם לציבור.
- **D.** Rely on an independent public and professional review, rather than a state commission.

  להסתמך על בדיקה ציבורית ומקצועית עצמאית, במקום ועדת חקירה ממלכתית.

Components: Independent statutory commission / Who appoints the members?.

| Choice | Independent statutory commission | Who appoints the members? |
|---|---|---|
| A | Yes | President of the Supreme Court |
| B | Yes | Government–opposition agreement |
| C | No | Government |
| D | No | Public and professional bodies |

### Q14 · How should the prime minister's tenure and accountability be regulated?
**כיצד יש להסדיר את משך כהונת ראש הממשלה ואת האחריות כלפי הציבור?**
- **A.** Limit the prime minister to two terms, even if voters would otherwise elect them again.

  להגביל את ראש הממשלה לשתי כהונות, גם אם הבוחרים היו מעוניינים לבחור בו שוב.
- **B.** Set an eight-year cumulative limit, regardless of how many governments or elections occur.

  לקבוע הגבלה מצטברת של שמונה שנים, בלי קשר למספר הממשלות או מערכות הבחירות.
- **C.** Allow unlimited terms but add a public recall procedure between elections.

  לאפשר כהונות ללא הגבלה, אך להוסיף הליך הדחה ביוזמת הציבור בין בחירות.
- **D.** Keep tenure unlimited and leave replacement to elections and parliamentary confidence.

  להשאיר את משך הכהונה ללא הגבלה ולהותיר את ההחלפה לבחירות ולאמון הכנסת.

Components: Binding tenure limit / Accountability mechanism.

| Choice | Binding tenure limit | Accountability mechanism |
|---|---|---|
| A | Yes | Two-term limit |
| B | Yes | Eight-year cumulative limit |
| C | No | Public recall mechanism |
| D | No | Elections and parliamentary confidence |

### Q15 · How should the law recognize same-sex families?
**כיצד צריך החוק להכיר במשפחות של זוגות מאותו מין?**
- **A.** Give same-sex parents equal legal status; decide adoption and surrogacy eligibility separately.

  להעניק להורים מאותו מין מעמד משפטי שווה, ולהסדיר בנפרד את הזכאות לאימוץ ולפונדקאות.
- **B.** Provide equal parental recognition and equal adoption criteria; regulate surrogacy separately.

  להעניק הכרה הורית שווה ותנאי אימוץ שווים, ולהסדיר פונדקאות בנפרד.
- **C.** Apply equal parental recognition and the same eligibility criteria to adoption and surrogacy.

  להעניק הכרה הורית שווה ולהחיל תנאי זכאות זהים באימוץ ובפונדקאות.
- **D.** Do not give same-sex couples equivalent joint parental status, and reserve adoption and surrogacy routes for different-sex couples.

  לא להעניק לזוגות מאותו מין מעמד הורי משותף מקביל, ולייחד מסלולי אימוץ ופונדקאות לזוגות ממינים שונים.

Components: Equal legal parental status / Adoption and surrogacy policy.

| Choice | Equal legal parental status | Adoption and surrogacy policy |
|---|---|---|
| A | Yes | Decide access routes separately |
| B | Yes | Equal adoption criteria; surrogacy separate |
| C | Yes | Equal adoption and surrogacy criteria |
| D | No | Reserve routes for different-sex couples |

### Q16 · School choice and admissions: how should funding and pupil selection work?
**בחירת בית ספר וקבלת תלמידים: כיצד יש לקבוע את המימון ואת כללי הקבלה?**
- **A.** Let funding follow the child to a parent-chosen school, with open admissions and a fair allocation rule when places run out.

  לתקצב באמצעות שובר לבית הספר שבחרו ההורים, עם קבלה פתוחה וכלל הקצאה הוגן כשהביקוש עולה על מספר המקומות.
- **B.** Let funding follow the child, while allowing schools to use published educational admission criteria.

  לתקצב באמצעות שובר שהולך עם התלמיד, ולאפשר לבתי הספר להשתמש בקריטריוני קבלה חינוכיים שיפורסמו מראש.
- **C.** Fund institutions directly and offer choice within a public network, with open admissions and fair allocation.

  לתקצב מוסדות ישירות ולהציע בחירה בתוך רשת ציבורית, עם קבלה פתוחה והקצאה הוגנת.
- **D.** Fund institutions directly but allow specialist schools to select pupils under published educational criteria.

  לתקצב מוסדות ישירות, אך לאפשר לבתי ספר ייחודיים למיין תלמידים לפי קריטריונים חינוכיים מפורסמים.

Components: Funding model / Admissions rules.

| Choice | Funding model | Admissions rules |
|---|---|---|
| A | Funding follows the child through a voucher | Open access with allocation when oversubscribed |
| B | Funding follows the child through a voucher | School-specific published selection criteria |
| C | Direct institutional budgets | Open access with allocation when oversubscribed |
| D | Direct institutional budgets | School-specific published selection criteria |

### Q17 · What should be the main approach to affordable housing?
**מה צריכה להיות הדרך המרכזית לקידום דיור בר־השגה?**
- **A.** Build a substantial new stock of publicly owned rental homes for eligible households.

  לבנות מלאי גדול של דירות ציבוריות חדשות להשכרה לזכאים.
- **B.** Expand public rental housing by buying homes from private builders, rather than making the state the builder.

  להרחיב דיור ציבורי להשכרה באמצעות רכישת דירות מקבלנים, במקום שהמדינה תהיה הגוף הבונה.
- **C.** Focus on private construction and long-term rental incentives, without expanding public ownership.

  להתמקד בבנייה פרטית ובתמריצים לשכירות ארוכת טווח, ללא הרחבת הבעלות הציבורית.
- **D.** Direct additional resources to rent assistance for households, rather than a larger public housing stock.

  להפנות משאבים נוספים לסיוע בשכר דירה למשקי בית, במקום להגדיל את מלאי הדיור הציבורי.
- **E.** Prioritize releasing land and simplifying development, without expanding publicly owned housing.

  לתעדף שחרור קרקעות ופישוט תהליכי פיתוח, ללא הרחבת מלאי הדיור בבעלות ציבורית.

Components: Expand publicly owned rental housing / Main housing tool.

| Choice | Expand publicly owned rental housing | Main housing tool |
|---|---|---|
| A | Yes | Public construction |
| B | Yes | Acquire homes from private builders |
| C | No | Private construction incentives |
| D | No | Rent assistance |
| E | No | Land-market reform |

### Q18 · How should wages, collective bargaining and industrial disputes be handled?
**כיצד יש להסדיר שכר, משא ומתן קיבוצי וסכסוכי עבודה?**
- **A.** Strengthen unions and collective bargaining, with strikes available after negotiation and voluntary mediation.

  לחזק התאגדות ומשא ומתן קיבוצי, עם אפשרות לשביתה לאחר משא ומתן וגישור מרצון.
- **B.** Strengthen collective bargaining, but require binding arbitration in essential services.

  לחזק משא ומתן קיבוצי, אך לחייב בוררות בשירותים חיוניים.
- **C.** Prioritize individual employment contracts and resolve disputes through negotiation and voluntary mediation.

  לתת עדיפות לחוזי עבודה אישיים וליישב סכסוכים במשא ומתן ובגישור מרצון.
- **D.** Prioritize individual contracts and use binding arbitration to resolve industrial disputes across sectors.

  לתת עדיפות לחוזים אישיים ולהכריע בסכסוכי עבודה באמצעות בוררות מחייבת בכלל הענפים.

Components: Main bargaining model / Dispute-resolution approach.

| Choice | Main bargaining model | Dispute-resolution approach |
|---|---|---|
| A | Strengthen collective bargaining | Negotiation and voluntary mediation |
| B | Strengthen collective bargaining | Binding arbitration in essential services |
| C | Prioritize individual contracts | Negotiation and voluntary mediation |
| D | Prioritize individual contracts | Binding arbitration across sectors |

### Q19 · What service framework should apply to Arab citizens?
**איזו מסגרת שירות צריכה לחול על אזרחים ערבים?**
- **A.** Require civilian service, with a choice of placements in healthcare, emergency services, education or local communities.

  לחייב שירות אזרחי, עם בחירה בין בריאות, חירום, חינוך או מסגרות קהילתיות.
- **B.** Apply the same service obligation as to other citizens: military service where needed, with a civilian alternative.

  להחיל חובת שירות כמו על יתר האזרחים: שירות צבאי לפי הצורך, עם חלופה אזרחית.
- **C.** Keep service voluntary and support community-run programs shaped by Arab municipalities and civil society.

  להשאיר את השירות התנדבותי ולתמוך בתוכניות קהילתיות בעיצוב רשויות ערביות והחברה האזרחית.
- **D.** Keep service voluntary while opening military and national civilian routes on equal terms.

  להשאיר את השירות התנדבותי ולפתוח מסלולים צבאיים ואזרחיים ארציים בתנאים שווים.
- **E.** Do not create a service obligation or a dedicated national-service framework; invest directly in ordinary public services.

  לא ליצור חובת שירות או מסגרת שירות לאומי ייעודית; להשקיע ישירות בשירותים ציבוריים רגילים.

Components: Compulsory service / Service framework.

| Choice | Compulsory service | Service framework |
|---|---|---|
| A | Yes | Choice among civilian placements |
| B | Yes | Military priority with civilian alternative |
| C | No | Community-run voluntary service |
| D | No | Voluntary national military/civilian routes |
| E | No | No dedicated service framework |

### Q20 · Which approach should lead climate and energy policy?
**איזו גישה צריכה להוביל את מדיניות האקלים והאנרגיה?**
- **A.** Set binding emissions targets in law and fund sector-by-sector plans for transport, buildings and energy.

  לקבוע בחוק יעדי פליטות מחייבים ולתקצב תוכניות ענפיות לתחבורה, למבנים ולאנרגיה.
- **B.** Set binding emissions targets, but rely mainly on carbon pricing and let firms choose how to reduce emissions.

  לקבוע יעדי פליטות מחייבים, אך להסתמך בעיקר על תמחור פחמן ולאפשר לחברות לבחור כיצד להפחית פליטות.
- **C.** Avoid binding national targets; prioritize clean technology, efficiency and competitive energy markets.

  להימנע מיעדים לאומיים מחייבים ולתעדף טכנולוגיה נקייה, התייעלות ושוק אנרגיה תחרותי.
- **D.** Prioritize nuclear generation for reliable low-emission electricity, without binding national emissions targets.

  לתעדף ייצור גרעיני לחשמל אמין ודל פליטות, ללא יעדי פליטות לאומיים מחייבים.
- **E.** Keep binding emissions targets, with nuclear generation as the main long-term supply strategy.

  לשמור על יעדי פליטות מחייבים, עם ייצור גרעיני כאסטרטגיית אספקה מרכזית לטווח הארוך.

Components: Binding emissions targets / Main policy instrument.

| Choice | Binding emissions targets | Main policy instrument |
|---|---|---|
| A | Yes | Funded sectoral plans |
| B | Yes | Carbon pricing |
| C | No | Technology and efficiency incentives |
| D | No | Nuclear generation |
| E | Yes | Nuclear generation |

### Q21 · How should parties include women in their electoral lists?
**כיצד צריכות מפלגות לשלב נשים ברשימותיהן לכנסת?**
- **A.** Reserve the party’s political representation for men: bar women from its electoral list on religious grounds, as Shas and United Torah Judaism do, with no requirement for women’s representation.

  לייחד את הייצוג הפוליטי של המפלגה לגברים בלבד: לאסור על נשים להתמודד ברשימתה מטעמים דתיים, כפי שנוהגות ש״ס ויהדות התורה, ללא דרישה לייצוג נשים.
- **B.** Open candidacy to women and men; choose candidates without gender quotas or special incentives.

  לפתוח התמודדות לנשים ולגברים ולבחור מועמדים ללא מכסות מגדריות או תמריצים מיוחדים.
- **C.** Open candidacy equally and encourage women through recruitment programmes and party-funding incentives, without binding quotas.

  לפתוח התמודדות שוויונית ולעודד נשים באמצעות תוכניות גיוס ותמריצים במימון מפלגות, ללא מכסות מחייבות.
- **D.** Open candidacy equally and reserve a minimum share of viable list places for women, while leaving other places to ordinary selection.

  לפתוח התמודדות שוויונית ולהבטיח לנשים שיעור מינימלי מהמקומות הריאליים; יתר המקומות ייקבעו בהליך הבחירה הרגיל.
- **E.** Require equal representation, with women and men alternating throughout the electoral list.

  לקבוע ייצוג שווה לנשים ולגברים, במקומות לסירוגין לאורך הרשימה.

Components: Access to candidacy / Mechanism for representation.

| Choice | Access to candidacy | Mechanism for representation |
|---|---|---|
| A | Rules barring women from candidacy | No special mechanism |
| B | Open to women and men | No special mechanism |
| C | Open to women and men | Recruitment and financial incentives |
| D | Open to women and men | Guaranteed minimum in viable places |
| E | Open to women and men | Parity and alternating places |

### Q22 · How should the state promote women’s equality in work, education and public life while addressing community traditions?
**כיצד על המדינה לקדם שוויון לנשים בתעסוקה, בהשכלה ובחיים הציבוריים, תוך התייחסות למסורות קהילתיות?**
- **A.** Actively remove barriers to women’s employment, pay and public leadership, and support shared caregiving; provide common public services without gender separation as the rule.

  להסיר באופן פעיל חסמים בפני נשים בתעסוקה, בשכר ובהנהגה ציבורית, ולתמוך בחלוקת הטיפול במשפחה; להפעיל ככלל שירותים ציבוריים ללא הפרדה מגדרית.
- **B.** Enforce equal legal access to jobs, education and leadership without gender-specific programmes; keep public services common to women and men.

  לאכוף גישה משפטית שווה לעבודה, להשכלה ולהנהגה ללא תוכניות מגדריות ייעודיות; לקיים שירותים ציבוריים משותפים לנשים ולגברים.
- **C.** Actively remove barriers to women’s employment and public leadership; allow separate services where participation is voluntary, resources equal and a mixed alternative accessible.

  להסיר באופן פעיל חסמים בפני נשים בתעסוקה ובהנהגה ציבורית; לאפשר שירותים נפרדים כאשר ההשתתפות מרצון, המשאבים שווים וחלופה מעורבת נגישה.
- **D.** Guarantee women equal legal access to work, education and public leadership without special gender programmes; permit voluntary separate settings with equal resources and an accessible mixed alternative.

  להבטיח לנשים גישה משפטית שווה לעבודה, להשכלה ולהנהגה ציבורית ללא תוכניות מגדריות מיוחדות; להתיר מסגרות נפרדות מרצון עם משאבים שווים וחלופה מעורבת נגישה.
- **E.** Allow religious communities to reserve their political leadership and public representation for men, and to maintain gender-separated institutions with public funding; limit state intervention in these rules.

  לאפשר לקהילות דתיות לייחד את הנהגתן הפוליטית ואת ייצוגן הציבורי לגברים בלבד, ולקיים מוסדות בהפרדה מגדרית במימון ציבורי; לצמצם את התערבות המדינה בכללים אלה.

Components: State approach to equality / Gender separation in publicly funded settings.

| Choice | State approach to equality | Gender separation in publicly funded settings |
|---|---|---|
| A | Targeted measures to remove structural barriers | Common services as the rule |
| B | Equal legal rules without gender-specific programmes | Common services as the rule |
| C | Targeted measures to remove structural barriers | Separate options with free choice and equal access |
| D | Equal legal rules without gender-specific programmes | Separate options with free choice and equal access |
| E | Community autonomy over gender roles | Community rules may govern separate settings |

## Source registry

Dates and retrieval limitations are preserved from the research. An undated live page is not proof of a newly issued 2026 manifesto.

| ID | Source | Date | Note |
|---|---|---|---|
| Y | [Yashar: ten-step programme](https://yasharwitheisenkot.com/agenda_point/) | Undated | Retrieved on 2026-09-29; publication date not stated. Full agenda reviewed; replaces the earlier homepage reference. |
| D | [Democrats: agenda, July 2025](https://democrats.org.il/wp-content/uploads/2025/09/agenda2025.pdf) | 2025-07 | Date taken from the document cover, not search-engine publication metadata. Newer plans also exist at yes.democrats.org.il; the parsed index did not expose their text. |
| DC | [Democrats: current commitments](https://fighters.democrats.org.il/) | Undated |  |
| B | [Beyahad: published plans](https://be-yahad.org.il/plans/?bennett_plans_cat=198) | Undated |  |
| BE | [Beyahad: environment plan](https://be-yahad.org.il/plans/enviroment/) | Undated |  |
| IB | [Yisrael Beytenu: platform](https://beytenu.org.il/party-platform/) | Undated | Current living page; contains both new priorities and legacy sections. Unresolved internal tensions must be flagged. |
| Z | [Zehut: full web platform](https://zehut.org.il/platform/full) | Undated |  |
| ZC | [Zehut: compass](https://zehut.org.il/compass) | Undated |  |
| RD | [Religious Zionism: platform index](https://zionutdatit.org.il/מצע-המפלגה/) | Undated | Official index retrieved directly on 2026-09-29. It links dated 2021–22 platform PDFs; those are labeled historical. |
| RJ | [Religious Zionism: Law and Justice booklet](https://digitaler.cld.bz/zionutdatit) | Undated | Earlier booklet. A September 2026 sequel exists; see RJ2. Do not label this booklet the 2026 edition. |
| RJ2 | [N12: publication of Law and Justice 2.0](https://www.mako.co.il/news-israel-elections/2026/Article-8bc88f253f4a0a1027.htm) | 2026-09-15 |  |
| RS | [Knesset: Smotrich calls for sovereignty](https://main.knesset.gov.il/News/PressReleases/pages/press29.07.25cx.aspx) | 2025-07-29 | Indexed excerpt contains the call for a sovereignty decision; direct page returned no parsed text. |
| O | [Otzma Yehudit: Disengagement 710 plan](https://ozmayeudit.com/יו״ר-עוצמה-יהודית-השר-בן-גביר-מציג-את-תו/) | 2026-09-04 | Retrieved in indexed text. Concerns state-supported emigration; does not itself establish positions on civilian settlements, taxation or marriage. |
| OH | [Otzma Yehudit: archived principles](https://www.idi.org.il/media/13907/עוצמה-יהודית.pdf) | Undated | Image-only historical document located; not used to code unseen text. |
| OI | [IDI: Otzma Yehudit](https://www.idi.org.il/policy/parties-and-elections/parties/otzma-yehudit/) | Undated |  |
| L | [Likud: constitution](https://www.likud.org.il/images/veida4_docs/60.pdf) | Undated | Historical/standing principles, not a newly published election platform; indexed text retrieved. |
| LI | [IDI: Likud and its platform publication history](https://www.idi.org.il/policy/parties-and-elections/parties/likud/) | Undated |  |
| LS | [Prime Minister's Office: Netanyahu on Palestinian statehood](https://www.gov.il/en/pages/spoke-pm210925) | 2025-09-21 |  |
| S | [Shas: principles for the 17th Knesset](https://www.idi.org.il/media/6856/shas-17.pdf) | 2006 | Explicit references to the 17th Knesset and targets for 2007. Not a 2026 platform. |
| UT | [United Torah Judaism: archived platform](https://www.idi.org.il/media/16889/יהדות-התורה-1999.pdf) | 1999 | Election year from archive attribution; saved copy carries 2002 print metadata. |
| R | [Ra'am: archived platform](https://www.idi.org.il/media/16883/רעמ-1999.pdf) | 1999 | Saved copy carries 2002 metadata; historical only. |
| RI | [IDI: Ra'am](https://www.idi.org.il/policy/parties-and-elections/parties/raam/) | Undated |  |
| H | [Hadash: current principles](https://hadash.org.il/) | Undated |  |
| HH | [Hadash: 2013 platform](https://www.idi.org.il/media/6524/חדש.pdf) | 2013 | The document explicitly identifies the 19th Knesset. The original /matzahadash/ URL now returns 404. |
| H22 | [Zo Haderekh: Hadash–Ta'al 2022 economic program](https://zoha.org.il/116306/) | 2022-10-27 |  |
| TI | [IDI: Ta'al](https://www.idi.org.il/policy/parties-and-elections/parties/ta-al/) | Undated | No standalone current primary platform located in this search. |
| BA | [Balad: political program](https://www.altajamoa.org/نصوص-مؤسسة/2017/03/29/البرنامج-السياسي) | 2017-03-29 | Arabic text reread directly. Page bears 2017-03-29 but contains later references as well as older passages; revision dates are unclear. Kept historical, with separately labelled continuity inferences. |
| DR | [Ynet: parties' responses on conscription](https://www.ynet.co.il/news/elections2026/article/yokra14898966) | 2026-09-16 | Party responses distinguished from the reporter's characterizations. Joint List response is attributed to the list, not separately asserted by all components. |
| BW | [Blue and White: principles](https://kachollavan.org.il/wp-content/uploads/2025/07/20527_3_A5_Hoveret_Ekronot_ONE_PAGE_A.pdf) | 2025-07 (file path) |  |
| M | [Reservists: platform](https://www.themiluimnikim.org.il/platform/) | Undated | Full live programme reviewed on 2026-09-29, including service, crime, term limits and competition. Undated; not labelled as a new manifesto. |
| REG | [Platform discovery index](https://www.dor-why.co.il/platforms) | 2026-09-15 | Used to locate originals; summaries and electoral-list labels are not the party answer key. |
| RDS | [Religious Zionism: sovereignty policy](https://zionutdatit.org.il/hityashvut/sovereignty/) | Undated | Official page retrieved directly on 2026-09-29. Publication date not stated; not labeled a newly issued manifesto. |
| RDJ21 | [Religious Zionism: judicial platform](https://zionutdatit.org.il/wp-content/uploads/2021/12/משפט.pdf) | 2021-12 | Linked by the official platform index. PDF metadata and 24th-Knesset wording establish age; judicial-appointment section visually inspected. |
| RDI21 | [Religious Zionism: Jewish identity platform](https://zionutdatit.org.il/wp-content/uploads/2021/12/זהות-יהודית.pdf) | 2021-12 | Official linked PDF, visually inspected. Used for the Jewish/democratic identity component; general status-quo language is not a complete answer on transport or marriage. |
| RDE21 | [Religious Zionism: economic platform](https://zionutdatit.org.il/wp-content/uploads/2021/12/כלכלה.pdf) | 2021-12 | Official linked PDF, visually inspected. Explicitly calls for compulsory arbitration in essential services. |
| RDB23 | [Religious Zionism: 2023–24 budget policy](https://zionutdatit.org.il/budget/) | 2023–2024 | Official text retrieved directly; internal budget-year references establish date. Not a new 2026 program. |
| OZ20 | [Otzma Yehudit: principles for the 23rd Knesset election (2020)](https://www.knesset.tv/media/34728/מצע-עוצמה-יהודית.pdf) | 2020-01-28 | Party principles archived by the Knesset channel; heading explicitly dates the election document. Section 4 visually inspected. Historical evidence, not a 2026 manifesto. |
| Y_ED | [Yashar: education plan](https://yasharwitheisenkot.com/principles/education/) | Undated | Retrieved on 2026-09-29; publication date not stated. Detailed funding conditions qualify the broad core-for-all pledge. |
| Y_SERVICE | [Yashar: service for all](https://yasharwitheisenkot.com/principles/service-for-all/) | Undated | Retrieved on 2026-09-29; publication date not stated. Direct programme; limited deferrals are distinguished from sector-wide exemptions. |
| Y_ECON | [Yashar: economy and cost of living](https://yasharwitheisenkot.com/principles/economics/) | Undated | Retrieved on 2026-09-29; publication date not stated. Substantive policy sections reviewed; the page also contains a placeholder paragraph, which is not evidence. |
| Y_INQUIRY | [Yashar: state inquiry proposal (consultation draft)](https://yasharwitheisenkot.com/wp-content/uploads/2026/08/מתווה-ישר-לועדת-חקירה-ממלכתית-לטבח-ה-7-באוקטובר-טיוטה-לשיתוף-הציבור.pdf) | Undated | Retrieved on 2026-09-29; publication date not stated. Linked from /vaadat-hakira/. PDF page 3 specifies judicial appointment. Consultation remains open until 2026-10-07; this is a party proposal, not enacted policy. |
| IDI_BALAD | [IDI: Balad party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/balad/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_HADASH | [IDI: Hadash party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/hadash/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_TAAL | [IDI: Ta’al party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/taal/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_RAAM | [IDI: Ra’am party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/raam/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_SHAS | [IDI: Shas party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/shas/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_UTJ | [IDI: United Torah Judaism party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/united-torah-judaism/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_LIKUD | [IDI: Likud party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/likud/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| IDI_OTZMA | [IDI: Otzma Yehudit party profile](https://en.idi.org.il/israeli-elections-and-parties/parties/otzma-yehudit/) | Undated | Undated institutional profile, reviewed 2026-09-29. Describes standing ideology; not a newly published 2026 manifesto. Narrow policy deductions are separately labeled I. |
| TOI_REL26 | [ToI: Bennett backs Shabbat transport and civil marriage; Shas and UTJ respond](https://www.timesofisrael.com/liveblog_entry/ex-pm-bennett-backs-public-transport-on-shabbat-civil-marriage-sparking-haredi-backlash/) | 2026-04-20 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_SCHOOL26 | [ToI: additional funding for Haredi school networks](https://www.timesofisrael.com/state-budget-set-to-increase-spending-on-haredi-education-by-nis-1-billion/amp/) | 2026-02-19 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_SCHOOL25 | [ToI: committee funds private and exempt Haredi schools](https://www.timesofisrael.com/knesset-finance-committee-approves-additional-nis-177m-for-private-haredi-schools/amp/) | 2025-08-12 | Reports direct funding of exempt and party-affiliated schools; interpretations of core-curriculum requirements are labeled as inferences. |
| AP_DRAFT25 | [AP: Shas and UTJ leave government over draft exemptions](https://apnews.com/article/b58b8705277f27fa41f664c341e5a93e) | 2025-07-16 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_JUDGES25 | [ToI: political control over judicial appointments](https://www.timesofisrael.com/knesset-passes-law-greatly-boosting-political-control-over-judicial-appointments/) | 2025-03-27 | The 2025 committee model is not identical to direct appointment by parliament. Any mapping to the quiz’s broader political-selection approach is labeled an inference. |
| TOI_PROBE26 | [ToI: Likud’s alternative October 7 inquiry bill](https://www.timesofisrael.com/call-for-independent-inquiry-removed-from-coalition-bill-establishing-oct-7-probe/amp/) | 2026-05-13 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_PROBE25 | [ToI: Blue and White presses for a state inquiry](https://www.timesofisrael.com/liveblog_entry/lawmakers-defeat-motion-to-establish-state-commission-of-inquiry-into-october-7/) | 2025-12-22 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_GAZA_RZ25 | [ToI: Smotrich advocates renewed Gaza settlements](https://www.timesofisrael.com/liveblog_entry/smotrich-says-return-of-jewish-settlements-to-gaza-now-realistic-needs-to-be-much-bigger-than-before/) | 2025-07-29 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_GAZA_OZ24 | [ToI: Ben Gvir and Smotrich advocate Gaza resettlement](https://www.timesofisrael.com/ben-gvir-suggests-netanyahu-open-to-encouraging-palestinian-migration-from-gaza/) | 2024-12-01 | Dated reporting of Ben Gvir’s position; not evidence for the stance of every coalition party. |
| TOI_CRIME25 | [ToI: Ben Gvir backs treating criminal organizations as terror groups](https://www.timesofisrael.com/government-greenlights-bill-to-label-certain-crime-organizations-as-terror-groups/) | 2025-10-19 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_ARAB_CRIME26 | [ToI: Arab party leaders demand effective policing against organized crime](https://www.timesofisrael.com/arab-blood-isnt-cheap-hundreds-rally-in-capital-alleging-police-failure-on-violent-crime/amp/) | 2026-01-11 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| TOI_ODEH24 | [ToI: Odeh opposes compulsory military service](https://www.timesofisrael.com/liveblog_entry/top-arab-mk-odeh-slams-haredi-idf-draft-law-citing-opposition-to-mandatory-consription/) | 2024-06-10 | Reviewed secondary source; publication date is shown separately from retrieval date. |
| YNET_SERVICE12 | [Ynet: competing views on compulsory national service for Arabs](https://www.ynetnews.com/articles/0%2C7340%2CL-4232623%2C00.html) | 2012 | Historical report: never treated as a new statement by today’s party leadership. |
| YNET_BALAD08 | [Ynet: Balad platform profile](https://www.ynetnews.com/articles/0%2C7340%2CL-3502144%2C00.html) | 2008 | Historical secondary profile; constitutional commitment is marked H. |
| TOI_ARAB20 | [ToI: differences among the four Joint List parties](https://www.timesofisrael.com/joint-list-4-arab-parties-on-1-slate-is-poles-apart-but-strong-together/amp/) | 2020 | Historical comparative profile. Secularism is not assumed to imply an identical stance on every family-policy question. |
| TOI_RZ_REL19 | [ToI: Smotrich on religious law, marriage and Shabbat](https://www.timesofisrael.com/smotrich-says-israel-should-follow-torah-law-again-drawing-ire-of-liberman/) | 2019 | Historical statement before the current party configuration; used only with the historical filter. |
| AR_HB_SERVICE26 | [Al-Ittihad: Hadash–Balad statement against conscription](https://alittihad44.com/الجماهير-العربية/news-2026-07-19-ninzrg) | 2026-07-19 | Joint statement explicitly attributed to these two parties; not generalized to Ta’al or Ra’am. |
| AR_TAAL_INQUIRY | [Radio Nas: Ahmad Tibi on an October 7 inquiry](https://www.nasapp.net/article/r1xn4nd7zx) | Undated | Direct interview; visible page lacks a publication date. Discussion concerns passage of the 2026 budget. Appointment mechanism not specified. |
| AR_TAAL_POLICE25 | [Knooz: Tibi calls on police to fight criminal organizations](https://www.knooznet.com/?app=article.show.86211) | 2025-01-28 | Individual reactions are attributed separately. Opposition to banning a community organization does not establish a blanket position on Shin Bet assistance. |
| AR_RAAM_CRIME26 | [Kul al-Arab: Abbas press conference on policing](https://www.kul-alarab.com/Article/1125398) | 2026-07-06 | Reported party-leader press conference; criticism of the proposed Shin Bet intervention is not treated as opposition to every possible intelligence role. |
| AR_RAAM_BUDGET26 | [Radio Nas: Abbas opposes cuts to the five-year development plan](https://www.nasapp.net/article/sj0diocf11g) | Undated | Interview explicitly discusses 2026, but the visible page does not give a publication date. Protecting budgets does not establish a tax policy. |
| AR_HADASH_ED26 | [Al-Ittihad: Hadash teachers’ faction education statement](https://alittihad44.com/الجماهير-العربية/news-2026-08-30-qy3cla) | 2026-08-30 | Indexed Arabic statement from Hadash’s teachers’ faction. Scope is education; does not establish a nationwide fiscal package. |
| YNET_TRANSPORT26 | [Ynet: parties’ responses on Shabbat transport](https://www.ynet.co.il/news/elections2026/article/yokra14883243) | 2026-08-31 | Uses attributed party responses, not voter polling. Joint List response is not silently assigned to individual component parties. |
| RZ_GAZA26 | [News1: Smotrich advocates Israeli government and settlements in Gaza](https://www.news1.co.il/Archive/001-D-522346-00.html) | 2026-08-16 | Reported speech by the party leader; distinguishes his proposal from adopted government policy. |
| STATEHOOD26 | [JDN: party leaders respond to Abbas’s statehood statement](https://www.jdn.co.il/news/2714260/) | 2026-08-22 | Positions are assigned only to the named speakers. Eisenkot’s statement concerns the government he proposes to form. |
| O710 | [Otzma Yehudit: Disengagement 710 programme](https://710.ozma-yeudit.co.il/) | Undated | Reviewed as a current campaign document. Its emigration mechanism does not specify the quiz’s civil-administration model. |
| W_LIST26 | [IDI: women in the 2026 electoral lists](https://www.idi.org.il/articles/66220) | 2026-09-22 | List presence supports access to candidacy only. Poll-dependent percentages are not scored and do not establish quota rules. Joint-list figures are not assigned to component parties. |
| W_RULES26 | [IDI: candidate-selection rules for 2026](https://www.idi.org.il/articles/65737) | Undated | Current election review: Likud guarantees named places; Democrats alternate women and men. Used for party rules, not a universal statutory obligation. |
| W_HAREDI | [IDI: Haredi local elections and exclusion of women](https://www.idi.org.il/articles/52982) | Undated | 2024 review reproduces Shas and UTJ’s older explanation of sex-specific political roles. Read with the 2026 lists; not a blanket description of all Haredi people or parties. |
| W_BEYAHAD | [Beyahad: programme on the status of women](https://be-yahad.org.il/plans/women/) | Undated | Official live plan. Distinguishes party-funding incentives from a 50% target for senior public-service posts. |
| W_DEMOCRATS | [Democrats: five-point vision, July 2025](https://democrats.org.il/wp-content/uploads/2025/09/vision0725.pdf) | 2025-07 | Pages 3 and 7: active inclusion and equal rights. Opposition to exclusion does not specify every voluntary-separation arrangement. |
| W_HADASH | [Hadash: current bilingual principles and candidates](https://hadash.org.il/) | Undated | Arabic and Hebrew principles explicitly support women’s equality; its own candidates include women. No Joint List attribution. |
| W_OTZMA26 | [Arutz 7: Son Har-Melech on separate academic tracks](https://www.inn.co.il/news/701665) | 2026-07-16 | Attributable statement supporting optional separate tracks. Does not establish every equality safeguard or a general position against women’s employment. |
| W_COALITION23 | [Law professors’ forum: gender separation provisions in coalition agreements](https://fs.knesset.gov.il/25/Committees/25_cs_bg_1834209.pdf) | 2023 | Historical analysis hosted by the Knesset; indexed text names Shas, UTJ and Religious Zionism separately. Direct PDF retrieval failed. Current continuity is explicitly an inference. |
| W_EXCLUSION26 | [Israel Women’s Network: exclusion of women from public life](https://iwn.org.il/wp-content/uploads/2026/02/נייר-עמדה-מטעם-שדולת-הנשים-בישראל-בנוגע-להדרת-נשים-במרחב-הציבורי.pdf) | 2026 | Advocacy organization’s submission to the Knesset committee, page 1: explicitly identifies ideological exclusion in Shas and UTJ. Used for party practice, not its separate legal assessment. Printed numeric and Hebrew dates are inconsistent; year only. |
