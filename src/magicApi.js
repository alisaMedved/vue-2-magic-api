import Vue from "vue";

let currentComponent = null;

export function onBeforeDestroyed(fn) {
  currentComponent.$on("hook:beforeDestroy", fn);
}

export function watch(...args) {
  return currentComponent.$watch(...args);
}

Vue.mixin({
  created() {
    if (!this.$options.setup) {
      return;
    }
    currentComponent = this;
    const reactiveVars = this.$options.setup.call(this);
    currentComponent = null;

    Object.assign(this, reactiveVars);
  },
});

/**
 * Думаю этот файл удачный в плане того чтобы записать все усвоенное о различии Vue2 и Vue3
 *
 * 1) Во вью3 переделали
 *
 * если рассматривать концепции вью3 и вью2 то можно придти к следующему мнению.
 * Во вью2 был template, blue print(это английское словосочетание означает - схема по которой надо создать компонент) -
 * то есть это то что написно в script, и this - это контекст, а именно сущность которая связывает разметку и blue print
 * (если мы копнем по глубже то мы узнаем что все что объвлялось в script пробрасывалось в шаблон с помощью промежуточного
 * проксирования).
 *
 *
 * Во вью3 немного переделали. Там есть набор функций/команд/макросов,
 * дающих реактивность (двухстроннне связывание) и с помощью которых
 * можно описывать эту самую blue print. runtime-dom - это система которая превращает вьюшный шаблон в
 * virtual dom и создает связь с кодом в blue print.
 * и последнеее это компилятор - превращающий единую render функцию в html и монтирующую узлы виртуал дома
 * в реальный DOM.
 *
 * в этих картинах следует заметить следующее? А куда делся this из картины vue3? И ответ простой
 * теперь мы его определяем сами, а не либа.
 *
 * я не ошибусь если скажу что сейчас вью сделал тот же переход что и реакт когда-то
 * (ушел с классовых компонентов на функциональные с хуками).
 *
 * 2) также следует отметить новую возможность вью. Если раньше в коде написанном на экземплярах класса нам
 * приходилось вытаскивать переиспользуемую логику или просто логически сепарируемую логику в mixins, то сейчас мы это делаем
 * с помощью кастомных хуков - во вью их зовут composable functions.
 *
 * Преимущества composable functions над миксинами:
 *
 * 1) у миксинов был не такой прозрачный контракт - не понятно было что они получают из компонента, а что выбрасывают в компонент.
 * При условии когда миксины переиспользуют выбрасыааемые сущности друг друга это превращается в ад.
 *
 * 2) composable functions удобно вкладывать в друг друга, в то время как миксин в миксин нельзя.
 *
 * -----
 *
 * Поговорим теперь о мелочах и о крупном, что тоже изменилось во вью3:
 * 1) data стала базироваться на прокси (во вью втором она базируется на гетерах и сеттерах). Понятное дело что прокси более удачный паттерн
 * для этого.
 * 2) рефы стали реактивными. Рефы могут принимать в себя функцию.
 * Рофляное замечание в том, что макрос выделяемый для рефа из апи вью теперь используется и для хранения
 * состояния компонента - на самом деле в мире вью это не рофл, но человека пришедшего с реакта может смутить.
 * 3) не нужно больше прописывать модификатор .native - вью автоматом если не получет событие нативное попытает счастья с кастомным.
 * 4) насчет видимости методов и переменных все так же кроме импортированных функций и переменных.
 * * В скрипте без setup вам нужно их как-то дополнительно подвязать - в date передать либо в methods как-нибудь вызывать
 * * в скрипте же с setup никаких таких подвязок не требуется можно сразу юзать.
 *
 * В общем вью ушел в сторону реакта.
 * Но мне кажется в определенном смысле вью теперь круче реакта. Ну давайте так
 * 1) у вью есть реактивность, а у реакта ее нет - есть только эдакая псевдо-реактивность setUpdate-ров
 * 2) у вью теперь тоже есть хуки
 */
