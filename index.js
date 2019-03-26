/*
* 函数先不断loding，直达页面高度高于window.高度，之后监听scoll,
* 根据scoll不断加载
*/

function ScrollLoading() {
    let index = 1;
    let total = 1;
    let lock = false;
    let fn = null;
    let handler = debounce(scroll);
    
    function next(data) {
        total = data.total;
        setTimeout(() => {
            if (needLoading() && index <= total) {
                fn(index++, next); 
            }
        }, 1000);
    }

    function scroll() {
        if (lock) return;
        if (nearByBottom() && index <= total) {
            lock = true;
            fn(index, ()=>{
                index++;
                lock = false;
            })
        }
    }

    function init(callBack) {
        fn = callBack;
        next({total: 1});
        window.addEventListener('scroll', handler);
    }

    function destroy() {
        index = 1;
        total = 1;
        lock = false;
        fn = null;
        handler = null;
        window.removeEventListener('scroll', handler);
    }

    return {
        init,
        destroy
    }
}

function debounce(fn, time = 300) {
    return (() => {
        if (fn.tid) clearTimeout(fn.tid);
        fn.tid = setTimeout(() => {
            fn();
            clearTimeout(fn.tid);
        }, time)
    })
}
// 判断是否加载下一页
function nearByBottom() {
    return getClientHeight() + window.scrollY + 20 > getScrollHeight();
}

// 获取当前可视范围的高度 
function getClientHeight() {
    return window.innerHeight;
}

// 获取文档完整的高度 
function getScrollHeight() { 
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
}

function getHtmlHeight() {
    let html = document.documentElement;
    return html.offsetHeight;
}
/**
 * 判断页面高度是否大于window高度
 */
function needLoading() {
    return getHtmlHeight() + 40 < getClientHeight();
}

const scroll = ScrollLoading();
export default scroll;
