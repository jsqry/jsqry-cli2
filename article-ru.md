# jsqry - лучше, чем jq

В своей [прошлой статье на Хабре](https://habr.com/ru/post/303624/) я писал про библиотеку [Jsqry](https://github.com/jsqry/jsqry), которая предоставляет простой и удобный язык запросов (DSL) к объектам JSON. С тех пор прошло много времени и библиотека тоже получила свое развитие. Отдельный повод для гордости - библиотека имеет 98% покрытие кода тестами. Однако в этой статье речь не совсем о ней.

Думаю, многие из вас знакомы с инструментом [`jq`](https://stedolan.github.io/jq/), который является практически стандартом де-факто для работы с JSON в командной строке и скриптах. Я тоже являлся её активным пользователем. Но меня все время беспокоила неоправданная сложность и неинтуитивность синтаксиса запросов этой утилиты. И не меня одного, вот лишь несколько цитат с [hacker news](https://news.ycombinator.com/):

> I have been using jq for years and still can't get it to work quite how I would expect it to.

> I have the same issue with jq. I need to use my google fu to figure out how to do anything more than a simple select.

> I don't know what the term would be, mental model, but I just can't get jq to click. Mostly because i only need it every once in a while. It's frustrating for me because it seems quite powerful.

> I know I might be a dissenting opinion here, but I can never wrap my head around `jq`. I can manage `jq .`, `jq .foo` and `jq -r`, but beyond that, the DSL is just opaque to me.

> Let's just say it: jq is an amazing tool, but the DSL is just bad.

> Yeah, I find jq similar to writing regexes: I always have to look up the syntax, only get it working after some confusion why my patterns aren't matching, then forget it all in a few days so have to relearn it again later.

Одним словом, вы уже наверное догадались. Пришла идея, а почему бы не обратить мою JS библиотеку в исполняемый файл для командной строки. <cut/>Здесь есть один нюанс. Библиотека написана на JS и [её DSL](https://github.com/jsqry/jsqry.github.io/blob/master/README.md) также опирается на JS. Это значит, что надо найти способ упаковать программу и какой-нибудь JS-runtime в самодостаточный исполняемый файл.

## jsqry - GraalVM edition

Для тех кто еще не в теме (неужели еще есть такие? oO) напомню, что [GraalVM](https://www.graalvm.org/) это такая прокачанная JVM от Oracle с дополнительными возможностями, самые заметные из которых:

1. Полиглотная JVM — возможность бесшовного совместного запуска Java, Javascript, Python, Ruby, R, и т.д. кода
2. Поддержка AOT-компиляции — компиляция Java прямо в нативный бинарник
3. Улучшения в JIT-компиляторе Java.

Освежить представление о Graal можно, например, в [этой хабра-статье](https://habr.com/ru/company/haulmont/blog/433432/).

Теоретически, объединение возможностей пунктов 1. и 2. должно решить поставленную задачу - обратить код на JS в исполняемый файл.  

Так родился проект https://github.com/jsqry/jsqry-cli. Правда, не спешите добавлять в закладки - в данный момент проект deprecated. Идея оказалась рабочей, но непрактичной. Дело в том, что размер исполняемого файла получался 99 Мб. Как-то не очень хорошо для простой утилиты командной строки. Тем более, если сравнить с `jq` с её размером 3.7 Мб для [последней версии для Linux 64](https://github.com/stedolan/jq/releases/tag/jq-1.6).

В идеале хотелось бы получить размер не больше мегабайта.

Тем не менее, решил оставить этот репозиторий как практический пример того как собрать из Java + JS кода исполняемый файл при помощи GraalVM.

## Небольшой обзор этого решения

Решение имеет основной код запускаемого приложения в единственном файле [App.java](https://github.com/jsqry/jsqry-cli/blob/master/src/main/java/com/github/jsqry/cli/App.java). Этот код выполняет обработку параметров командной строки, используя стандартную java-библиотеку [Apache Commons CLI](https://commons.apache.org/proper/commons-cli/).

Далее java-код вызывает код на javascript из файлов, находящихся в директории ресурсов src/main/resources.

При этом интересный момент. Вроде-бы простейший код для вычитывания содержимого файла из ресурса

```java
scripts.add(new String(Files.readAllBytes(Paths.get(jsFileResource.toURI()))));
```

под Граалем (то есть, будучи скомпилированным через [native-image](https://www.graalvm.org/reference-manual/native-image/)) падало с
 
```
java.nio.file.FileSystemNotFoundException: Provider "resource" not installed
```                

Выручил древний "хак" для чтения строки из `InputStream`

```java
scripts.add(new Scanner(jsFileResource.openStream()).useDelimiter("\\A").next());
```                         

Короче говоря, надеяться на 100% поддержку всех функций стандартной Java Граалем все еще не приходится.

Недавно аналогичной неприятной находкой оказалось [отсутствие поддержки java.awt.Graphics](https://github.com/oracle/graal/issues/1163). Это помешало использовать GraalVM для реализации AWS Lambda для конвертации картинок. 


## jsqry - QuickJS edition

Где-то в это же время я узнал о новом компактном движке JS [QuickJS](https://bellard.org/quickjs/) от гениального французского программиста [Фабриса Беллара](https://ru.wikipedia.org/wiki/%D0%91%D0%B5%D0%BB%D0%BB%D0%B0%D1%80,_%D0%A4%D0%B0%D0%B1%D1%80%D0%B8%D1%81). В своем составе этот инструмент несёт компилятор `qjsc` джаваскрипта в исполняемый файл. Также поддерживается почти полная совместимость с ES2020. То что нужно! 

Таким образом, появилась вторая инкарнация CLI-версии `jsqry`: https://github.com/jsqry/jsqry-cli2.
Этот подход оказался более жизнеспособным и уже принес несколько релизов.

Итак, что же такое `jsqry`?

`jsqry` это маленькая утилита командной строки (похожая на [jq](https://stedolan.github.io/jq/)) для выполнения запросов к JSON используя "человеческий" DSL.

Цель этой разработки - представить функционал JS библиотеки [jsqry](https://github.com/jsqry/jsqry) в форме интерфейса командной строки. 

## Примеры использования

#### запрос
```
$ echo '[{"name":"John","age":30},
         {"name":"Alice","age":25},
         {"name":"Bob","age":50}]' | jsqry 'name'
[
  "John",
  "Alice",
  "Bob"
]
```

#### первый элемент

```
$ echo '[{"name":"John","age":30},
         {"name":"Alice","age":25},
         {"name":"Bob","age":50}]' | jsqry -1 'name'
"John"
```

#### использование параметризации запроса

```
$ echo '[{"name":"John","age":30},{"name":"Alice","age":25},{"name":"Bob","age":50}]' \
    | jsqry '[ _.age>=? && _.name.toLowerCase().startsWith(?) ]' --arg 30 --arg-str joh 
[
  {
    "name": "John",
    "age": 30
  }
]
```

#### использование в роли простого JSON pretty-printer

```
$ echo '[{"name":"John","age":30},{"name":"Alice","age":25},{"name":"Bob","age":50}]' \
 | jsqry
[
  {
    "name": "John",
    "age": 30
  },
  {
    "name": "Alice",
    "age": 25
  },
  {
    "name": "Bob",
    "age": 50
  }
]
```

Выходной JSON утилиты по умолчанию отформатирован. И раскрашен!

#### что-то более хитрое

Отфильтровать элементы больше 2, добавить к каждому 100, отсортировать по убыванию и взять 2 последних элемента. Комбинируя эти возможности вы можете строить сколь угодно сложные запросы. [Узнать больше о поддерживаемом DSL](https://jsqry.github.io/).

```
$ echo '[1,2,3,4,5]' | jsqry '[_>2] {_+100} s(-_) [-2:]'
[
  104,
  103
]
```

#### полная мощь JS

Поскольку `jsqry` вмещает полноценный [JS-движок](https://bellard.org/quickjs/) в исполняемом файле менее 1 Мб, полная мощь JS в ваших руках!

```
$ echo '["HTTP://EXAMPLE.COM/123", 
         "https://www.Google.com/search?q=test", 
         "https://www.YouTube.com/watch?v=_OBlgSz8sSM"]' \
 | jsqry '{ _.match(/:\/\/([^\/]+)\//)[1].toLowerCase() }'
[
  "example.com",
  "www.google.com",
  "www.youtube.com"
]
```  

#### help-сообщение

```
$ jsqry
jsqry ver. 0.1.2
Usage: echo $JSON | jsqry 'query'
 -1,--first     return first result element
 -h,--help      print help and exit
 -v,--version   print version and exit
 -c,--compact   compact output (no pretty-print)
 -u,--unquote   unquote output string(s)
 -as ARG,
 --arg-str ARG  supply string query argument
 -a ARG,
 --arg ARG      supply query argument of any other type
```

## Небольшое сравнение с `jq`

А [здесь](https://gist.github.com/xonixx/d6066e83ec0773df248141440b18e8e4) я подготовил небольшое практическое сравнение `jq` и `jsqry` на примерах.  

## Установка

Текущая версия (на момент написания): [0.1.2](https://github.com/jsqry/jsqry-cli2/releases/tag/v0.1.2).

К сожалению, только Linux x64 поддерживается в данный момент. Надеюсь, поддержка других платформ будет скоро добавлена. Буду рад здесь вашей помощи. 

Чтобы установить или обновить утилиту, просто выполните в командной строке приведенную ниже команду:

```bash
$ sudo bash -e -c "
wget https://github.com/jsqry/jsqry-cli2/releases/download/v0.1.2/jsqry-linux-amd64 -O/usr/local/bin/jsqry
chmod +x /usr/local/bin/jsqry
echo \"jsqry \$(jsqry -v) installed successfully\" 
"
```

## О тестировании CLI-утилиты

При разработке утилиты на GitHub хотелось реализовать какое-то подобие автоматического тестирования. Юнит-тесты довольно просто писать, когда вы работаете на уровне языка программирования. Интереснее дело обстоит, если хочется протестировать CLI-утилиту как единое целое, как черный ящик. Благо, в нашем случае это должно быть просто и логично, поскольку утилита представляет собой то, что функциональщики бы назвали [чистой функцией](https://ru.wikipedia.org/wiki/%D0%A7%D0%B8%D1%81%D1%82%D0%BE%D1%82%D0%B0_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8) - выход определяется исключительно входом.

Попытав Гугл запросами вида "bash unit testing" и отметя варианты [BATS](https://opensource.com/article/19/2/testing-bash-bats), [ShellSpec](https://shellspec.info/), [Bach](https://bach.sh/) и несколько других подходов, как чересчур тяжеловесные для моего случая, а также самописную систему тестирования ([картинка про 14 стандартов](https://xkcd.ru/927/)), остановился на решении [tush](https://github.com/adolfopa/tush), гениальном в своей простоте.   

Тесты на `tush` представляют собой текстовый файл в таком синтаксисе

```
$ command --that --should --execute correctly
| expected stdout output

$ command --that --will --cause error
@ expected stderr output
? expected-exit-code
```

Причем `tush` разбирает только строки начинающиеся на `$`, `|`, `@` и `?` - все остальные могут быть любым текстом, например описанием соответствующих тестов. При запуске теста инструмент запускает все строки, начинающиеся на `$` и просто сравнивает реальный вывод с ожидаемым, используя обычный `diff`. В случае отличия тест заканчивается неудачей, а diff отличия выводится пользователю. Пример:

```
$ /bin/bash /home/xonix/proj/jsqry-cli2/tests.sh
--- tests.tush expected
+++ tests.tush actual
@@ -1,5 +1,5 @@
 $ jsqry -v
-| 0.1.2
+| 0.1.1
 
 $ jsqry -h
 | jsqry ver. 0.1.1
!!! TESTS FAILED !!!
```

Таким образом удалось покрыть тестами базовые сценарии работы с утилитой в виде одного файла
[tests.tush](https://github.com/jsqry/jsqry-cli2/blob/master/tests.tush).

Что особенно ценно, подобное тестовое описание одновременно может служить хорошую документирующую роль, демонстрируя типичные примеры использования.

Удалось этот тестовый сценарий реализовать [в виде GitHub Action](https://github.com/jsqry/jsqry-cli2/blob/master/.github/workflows/run-tests.yml), который запускается на каждый коммит, гарантируя корректность каждого изменения и предоставляя замечательный бейдж:
 
 [![Build and test](https://github.com/jsqry/jsqry-cli2/workflows/Build%20and%20test/badge.svg)](https://github.com/jsqry/jsqry-cli2/actions?query=workflow%3A%22Build+and+test%22)

## Другие особенности решения

### Раскрашивание JSON

Добавить раскраску выходного JSON оказалось на удивление [просто](https://github.com/jsqry/jsqry-cli2/blob/master/colorJson.js). Решение основано на подходе из проекта [zvakanaka/color-json](https://github.com/zvakanaka/color-json) с немного оптимизированными цветами, которые были подобраны на основе прекраснейшего StackOverflow [комментария](https://stackoverflow.com/a/28938235/104522). Для примера привожу сравнение раскраски с `jq`. В моей версии строки более яркие, а null имеет красный цвет для пущей заметности.

![screenshot](https://github.com/jsqry/jsqry-cli2/raw/master/article-1.png)

Понятно, что раскрашивание будет выполняться только при работе с терминалом.

### Подключение npm-версии библиотеки в QuickJS

Опишу немного процесс по которому [npm-версия](https://www.npmjs.com/package/jsqry) библиотеки `jsqry` подтягивается и включается в результирующий исполняемый файл. Для этого присутствует стандартный [package.json](https://github.com/jsqry/jsqry-cli2/blob/master/package.json) с необходимой версией библиотеки. Библиотека вытягивается стандартным `npm i`. Затем используется небольшой скрипт [prepare-for-qjs.py](https://github.com/jsqry/jsqry-cli2/blob/master/prepare-for-qjs.py), роль которого состоит в замене экспортирования в стиле nodejs на экспортирование в стиле модулей ES, только последнее поддерживается движком QuickJS. Далее уже полученный файл импортируется в основной код утилиты [jsqry-cli.js](https://github.com/jsqry/jsqry-cli2/blob/master/jsqry-cli.js).

### Чтение входной строки в UTF-8 в QuickJS

В случае QuickJS некоторой мороки стоит считывание строки из stdin. Дело в том, что [минималистичная стандартная библиотека](https://bellard.org/quickjs/quickjs.html#Standard-library), доступная в QuickJS, реализует только считывание байтов. Поэтому понадобился некоторый [ручной код](https://github.com/jsqry/jsqry-cli2/blob/master/jsqry-cli.js#L8), чтоб перегнать байтики UTF-8 в JS-строку. К счастью, его не пришлось изобретать, а удалось позаимствовать из другого проекта на QuickJS: [twardoch/svgop](https://github.com/twardoch/svgop).  

### Сборка утилиты

Сборка утилиты выполняется скриптом [build.sh](https://github.com/jsqry/jsqry-cli2/blob/master/build.sh).

Перечислю несколько "фишек" этого скрипта, которые оказались весьма полезными.

Первое - скрипт безусловно вызывает в самом конце скрипт тестов [tests.sh](https://github.com/jsqry/jsqry-cli2/blob/master/tests.sh). Это гарантирует, что каждая вновь собранная версия утилиты будет протестирована, а сборка развалится если тесты будут неудачны.

Второе - скрипт [build.sh](https://github.com/jsqry/jsqry-cli2/blob/master/build.sh) автоматически скачивает и компилирует заданную версию QuickJS, а скрипт [tests.sh](https://github.com/jsqry/jsqry-cli2/blob/master/tests.sh) выполняет то же для инструмента тестирования `tush`. Очень удобно - можно мгновенно продолжить разработку проекта на другой машине без лишних телодвижений.

Третий момент. В самом конце сборки выполняется команда `ls -lh jsqry` чтоб показать размер результирующего файла. Как я уже упомянул, я немного параноидален на этот счет, хочется чтоб CLI-утилита имела наименьший размер. Я рад, что это принесло полезный побочный результат - помогло устранить [регрессию](https://www.freelists.org/post/quickjs-devel/Increased-compiled-binary-size-with-latest-quickjs-release-20200705), выявленную этой проверкой в одном из прошлых релизов QuickJS.

В данный момент размер исполняемого файла составляет 652 KB. Мне кажется, довольно неплохо, учитывая что файл включает в себя полноценный движок современного стандарта JS. 

## В качестве послесловия

Прошу заинтересовавшихся попробовать представленную утилиту как замену `jq`. Также буду рад услышать ваши пожелания по доработке и конструктивную критику.