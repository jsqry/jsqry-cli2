
# Лучше, чем jq

В своей [прошлой статье на Хабре](https://habr.com/ru/post/303624/) я писал про библиотеку 
[Jsqry](https://github.com/jsqry/jsqry), которая предоставляет простой и удобный язык запросов DSL 
к объектам JSON. С тех пор прошло много времени и библиотека тоже получила свое развитие. 
Отдельный повод для гордости - библиотека имеет 98% покрытие кода тестами.
Однако в этой статье речь не совсем о ней.

Думаю, многие из вас знакомы с инструментом [`jq`](https://codefaster.substack.com/p/mastering-jq-part-1-59c), который является практически стандартом де-факто для 
работы с JSON в командной строке и скриптах. Я тоже являлся её активным пользователем.
Но меня все время беспокоила неоправданная сложность и неинтуитивность синтаксиса запросов этой утилиты.
И не меня одного, вот лишь несколько цитат с [hacker news](https://news.ycombinator.com/):

> I have been using jq for years and still can't get it to work quite how I would expect it to.

> I have the same issue with jq. I need to use my google fu to figure out how to do anything more than a simple select.

> I don't know what the term would be, mental model, but I just can't get jq to click. Mostly because i only need it every once in a while. It's frustrating for me because it seems quite powerful.

> I know I might be a dissenting opinion here, but I can never wrap my head around `jq`. I can manage `jq .`, `jq .foo` and `jq -r`, but beyond that, the DSL is just opaque to me.

> Let's just say it: jq is an amazing tool, but the DSL is just bad.

> Yeah, I find jq similar to writing regexes: I always have to look up the syntax, only get it working after some confusion why my patterns aren't matching, then forget it all in a few days so have to relearn it again later.

Одним словом, вы уже наверное догадались. Пришла идея, а почему бы не обратить мою JS библиотеку в исполняемый файл 
для командной строки.
Здесь есть один нюанс. Библиотека написана на JS и [её DSL](https://github.com/jsqry/jsqry.github.io/blob/master/README.md) 
также опирается на JS. 
Это значит что надо найти способ упаковать программу и какой-нибудь JS-runtime в самодостаточный исполняемый файл.

## jsqry - GraalVM edition

Для тех кто еще не в теме (неужели еще есть такие? oO) напомню, что GraalVM это такая прокачанная JVM от Oracle с дополнительными возможностями, самые заметные из которых:

1. Полиглотная JVM — возможность бесшовного совместного запуска Java, Javascript, Python, Ruby, R, и т.д. кода
2. Поддержка AOT-компиляции — компиляция Java прямо в нативный бинарник
3. Улучшения в JIT-компиляторе Java.

Освежить представление о Graal можно, например, в [этой хабра-статье](https://habr.com/ru/company/haulmont/blog/433432/).

Теоретически, объединение возможностей пунктов 1. и 2. должно решить поставленную задачу - обратить код на JS 
в исполняемый файл.  

Так родился проект https://github.com/jsqry/jsqry-cli.
Правда, не спешите добавлять в закладки - в данный момент проект deprecated. Идея оказалась рабочей, но непрактичной. Дело в том, что размер исполняемого файла 
получался 99 Мб. Как-то не очень хорошо для простой утилиты командной строки.
Тем более, если сравнить с `jq` с её размером 3.7 Мб для [последней версии для Linux 64](https://github.com/stedolan/jq/releases/tag/jq-1.6).

В идеале хотелось-бы получить размер не больше мегабайта.

## jsqry - QuickJS edition

Где-то в это же время я узнал о новом компактном движке JS [QuickJS](https://bellard.org/quickjs/) от гениального 
французского программиста [Фабриса Беллара](https://ru.wikipedia.org/wiki/%D0%91%D0%B5%D0%BB%D0%BB%D0%B0%D1%80,_%D0%A4%D0%B0%D0%B1%D1%80%D0%B8%D1%81).
В своем составе этот инструмент несет компилятор `qjsc` джаваскрипта в исполняемый файл.
Также поддерживается почти полная совместимость с ES2020.  
То что нужно! 

Таким образом, появилась вторая инкарнация CLI-версии `jsqry`: https://github.com/jsqry/jsqry-cli2


 
 

 