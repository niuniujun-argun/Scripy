class n {
    static name = "ENV";
    static version = "1.7.1";

    static about() {
        return console.log(`\n🟧 ${this.name} v${this.version}\n`);
    }

    constructor(e, t) {
        console.log(`\n🟧 ${n.name} v${n.version}\n`),
            (this.name = e),
            (this.logs = []),
            (this.isMute = !1),
            (this.isMuteLog = !1),
            (this.logSeparator = "\n"),
            (this.encoding = "utf-8"),
            (this.startTime = new Date().getTime()),
            Object.assign(this, t),
            this.log(`\n🚩 开始!\n${e}\n`);
    }

    platform() {
        return "undefined" != typeof $environment && $environment["surge-version"]
            ? "Surge"
            : "undefined" != typeof $environment && $environment["stash-version"]
                ? "Stash"
                : "undefined" != typeof module && module.exports
                    ? "Node.js"
                    : "undefined" != typeof $task
                        ? "Quantumult X"
                        : "undefined" != typeof $loon
                            ? "Loon"
                            : "undefined" != typeof $rocket
                                ? "Shadowrocket"
                                : "undefined" != typeof Egern
                                    ? "Egern"
                                    : void 0;
    }

    isNode() {
        return "Node.js" === this.platform();
    }

    isQuanX() {
        return "Quantumult X" === this.platform();
    }

    isSurge() {
        return "Surge" === this.platform();
    }

    isLoon() {
        return "Loon" === this.platform();
    }

    isShadowrocket() {
        return "Shadowrocket" === this.platform();
    }

    isStash() {
        return "Stash" === this.platform();
    }

    isEgern() {
        return "Egern" === this.platform();
    }

    async getScript(e) {
        return await this.fetch(e).then((e) => e.body);
    }

    async runScript(e, n) {
        let s = t.getItem("@chavy_boxjs_userCfgs.httpapi");
        s = s?.replace?.(/\n/g, "")?.trim();
        let o = t.getItem("@chavy_boxjs_userCfgs.httpapi_timeout");
        (o = 1 * o ?? 20), (o = n?.timeout ?? o);
        const [r, i] = s.split("@"),
            a = {
                url: `http://${i}/v1/scripting/evaluate`,
                body: {script_text: e, mock_type: "cron", timeout: o},
                headers: {"X-Key": r, Accept: "*/*"},
                timeout: o,
            };
        await this.fetch(a).then(
            (e) => e.body,
            (e) => this.logErr(e)
        );
    }

    initGotEnv(e) {
        (this.got = this.got ? this.got : require("got")),
            (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
            (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        e &&
        ((e.headers = e.headers ? e.headers : {}),
        void 0 === e.headers.Cookie &&
        void 0 === e.cookieJar &&
        (e.cookieJar = this.ckjar));
    }

    async fetch(t = {} || "", n = {}) {
        switch (t.constructor) {
            case Object:
                t = {...t, ...n};
                break;
            case String:
                t = {url: t, ...n};
        }
        t.method ||
        ((t.method = "GET"), (t.body ?? t.bodyBytes) && (t.method = "POST")),
            delete t.headers?.["Content-Length"],
            delete t.headers?.["content-length"];
        const s = t.method.toLocaleLowerCase();
        switch (this.platform()) {
            case "Loon":
            case "Surge":
            case "Stash":
            case "Egern":
            case "Shadowrocket":
            default:
                return (
                    delete t.id,
                    t.policy &&
                    (this.isLoon() && (t.node = t.policy),
                    this.isStash() &&
                    e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy))),
                    ArrayBuffer.isView(t.body) && (t["binary-mode"] = !0),
                        await new Promise((e, n) => {
                            $httpClient[s](t, (s, o, r) => {
                                s
                                    ? n(s)
                                    : ((o.ok = /^2\d\d$/.test(o.status)),
                                        (o.statusCode = o.status),
                                    r &&
                                    ((o.body = r), 1 == t["binary-mode"] && (o.bodyBytes = r)),
                                        e(o));
                            });
                        })
                );
            case "Quantumult X":
                return (
                    t.policy && e.set(t, "opts.policy", t.policy),
                        delete t.charset,
                        delete t.host,
                        delete t.path,
                        delete t.policy,
                        delete t.scheme,
                        delete t.sessionIndex,
                        delete t.statusCode,
                        t.body instanceof ArrayBuffer
                            ? ((t.bodyBytes = t.body), delete t.body)
                            : ArrayBuffer.isView(t.body)
                                ? ((t.bodyBytes = t.body.buffer.slice(
                                    t.body.byteOffset,
                                    t.body.byteLength + t.body.byteOffset
                                )),
                                    delete object.body)
                                : t.body && delete t.bodyBytes,
                        await $task.fetch(t).then(
                            (e) => (
                                (e.ok = /^2\d\d$/.test(e.statusCode)),
                                    (e.status = e.statusCode),
                                    e
                            ),
                            (e) => Promise.reject(e.error)
                        )
                );
            case "Node.js":
                let n = require("iconv-lite");
                this.initGotEnv(t);
                const {url: o, ...r} = t;
                return await this.got[s](o, r)
                    .on("redirect", (e, t) => {
                        try {
                            if (e.headers["set-cookie"]) {
                                const n = e.headers["set-cookie"]
                                    .map(this.cktough.Cookie.parse)
                                    .toString();
                                n && this.ckjar.setCookieSync(n, null),
                                    (t.cookieJar = this.ckjar);
                            }
                        } catch (e) {
                            this.logErr(e);
                        }
                    })
                    .then(
                        (e) => (
                            (e.statusCode = e.status),
                                (e.body = n.decode(e.rawBody, this.encoding)),
                                (e.bodyBytes = e.rawBody),
                                e
                        ),
                        (e) => Promise.reject(e.message)
                    );
        }
    }

    time(e, t = null) {
        const n = t ? new Date(t) : new Date();
        let s = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "H+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds(),
        };
        /(y+)/.test(e) &&
        (e = e.replace(
            RegExp.$1,
            (n.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
        for (let t in s)
            new RegExp("(" + t + ")").test(e) &&
            (e = e.replace(
                RegExp.$1,
                1 == RegExp.$1.length
                    ? s[t]
                    : ("00" + s[t]).substr(("" + s[t]).length)
            ));
        return e;
    }

    msg(e = name, t = "", n = "", s) {
        const o = (e) => {
            switch (typeof e) {
                case void 0:
                    return e;
                case "string":
                    switch (this.platform()) {
                        case "Surge":
                            return {url: e};
                        case "Stash":
                        case "Egern":
                        default:
                            return {url: e};
                        case "Loon":
                        case "Shadowrocket":
                            return e;
                        case "Quantumult X":
                            return {"open-url": e};
                        case "Node.js":
                            return;
                    }
                case "object":
                    switch (this.platform()) {
                        case "Surge":
                        case "Stash":
                        case "Egern":
                        case "Shadowrocket":
                        default:
                            return {url: e.url || e.openUrl || e["open-url"]};
                        case "Loon":
                            return {
                                openUrl: e.openUrl || e.url || e["open-url"],
                                mediaUrl: e.mediaUrl || e["media-url"],
                            };
                        case "Quantumult X":
                            return {
                                "open-url": e["open-url"] || e.url || e.openUrl,
                                "media-url": e["media-url"] || e.mediaUrl,
                                "update-pasteboard":
                                    e["update-pasteboard"] || e.updatePasteboard,
                            };
                        case "Node.js":
                            return;
                    }
                default:
                    return;
            }
        };
        if (!this.isMute)
            switch (this.platform()) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Egern":
                case "Shadowrocket":
                default:
                    $notification.post(e, t, n, o(s));
                    break;
                case "Quantumult X":
                    $notify(e, t, n, o(s));
                case "Node.js":
            }
        if (!this.isMuteLog) {
            let s = ["", "==============📣系统通知📣=============="];
            s.push(e),
            t && s.push(t),
            n && s.push(n),
                console.log(s.join("\n")),
                (this.logs = this.logs.concat(s));
        }
    }

    log(...e) {
        e.length > 0 && (this.logs = [...this.logs, ...e]),
            console.log(e.join(this.logSeparator));
    }

    logErr(e) {
        switch (this.platform()) {
            case "Surge":
            case "Loon":
            case "Stash":
            case "Egern":
            case "Shadowrocket":
            case "Quantumult X":
            default:
                this.log("", `❗️ ${this.name}, 错误!`, e);
                break;
            case "Node.js":
                this.log("", `❗️${this.name}, 错误!`, e.stack);
        }
    }

    wait(e) {
        return new Promise((t) => setTimeout(t, e));
    }

    done(t = {}) {
        const n = (new Date().getTime() - this.startTime) / 1e3;
        switch (
            (this.log("", `🚩 ${this.name}, 结束! 🕛 ${n} 秒`, ""), this.platform())
            ) {
            case "Surge":
                t.policy && e.set(t, "headers.X-Surge-Policy", t.policy), $done(t);
                break;
            case "Loon":
                t.policy && (t.node = t.policy), $done(t);
                break;
            case "Stash":
                t.policy &&
                e.set(t, "headers.X-Stash-Selected-Proxy", encodeURI(t.policy)),
                    $done(t);
                break;
            case "Egern":
            case "Shadowrocket":
            default:
                $done(t);
                break;
            case "Quantumult X":
                t.policy && e.set(t, "opts.policy", t.policy),
                    delete t.charset,
                    delete t.host,
                    delete t.method,
                    delete t.opt,
                    delete t.path,
                    delete t.policy,
                    delete t.scheme,
                    delete t.sessionIndex,
                    delete t.statusCode,
                    t.body instanceof ArrayBuffer
                        ? ((t.bodyBytes = t.body), delete t.body)
                        : ArrayBuffer.isView(t.body)
                            ? ((t.bodyBytes = t.body.buffer.slice(
                                t.body.byteOffset,
                                t.body.byteLength + t.body.byteOffset
                            )),
                                delete t.body)
                            : t.body && delete t.bodyBytes,
                    $done(t);
                break;
            case "Node.js":
                process.exit(1);
        }
    }
}

const I = new n("Moniepoint")

function sendRequest(reference, userId) {
    const options = {
        url: `https://moniepoint.argun.cc/smile?reference=${encodeURIComponent(reference)}&userid=${encodeURIComponent(userId)}`,
        timeout: 15
    };

    httpRequest(options, function (error, response, data) {
        if (error) {
            console.log('Error fetching data:', error);
            sendEmailLink(reference);
        } else if (response.status === 200) {
            I.msg(I.name, "已使用全自动过人脸 ✌️", "全自动过人脸成功 ✅️");
            console.log('Request succeeded');
            $done({body});
        } else {
            sendEmailLink(reference);
        }
    });
}

function sendEmailLink(reference) {
    let mailBody = reference;
    let mailtoUrl = `mailto:牛牛君@睁大眼看清楚.Argun?subject=Moniepoint Reference&body=${mailBody}`;
    I.msg(I.name, mailBody, "📧发送到邮箱复制", mailtoUrl);
    $done({body});
}

function httpRequest(options, callback) {
    const platformType = I.platform();
    switch (platformType) {
        case 'Surge':
        case 'Loon':
            $httpClient.get(options, callback);
            break;
        case 'Quantumult X':
            $task.fetch({
                url: options.url,
                method: "GET"
            }).then(response => {
                callback(null, {status: response.status, headers: response.headers}, response.body);
            }, error => {
                callback(error, null, null);
            });
            break;
        case 'Shadowrocket':
            $http.get({
                url: options.url,
                headers: {"Content-Type": "application/json"}  // 确认是否需要设置请求头
            }, function(error, response, data) {
                if (error) {
                    callback(error, null, null);
                } else {
                    callback(null, response, data);
                }
            });
            break;
        default:
            console.log(`Platform not supported: ${platformType}`);
            callback(new Error('Platform not supported'), null, null);
    }
}


const body = $response.body; // 获取响应体
try {
    const obj = JSON.parse(body); // 将响应体解析为JSON对象
    // 检查JSON对象中是否存在reference键和provider是否为"SMILE_ID"
    if (obj.reference && obj.provider === "SMILE_ID") {
        // 检查当前环境是否是Surge
        sendEmailLink(obj.reference);
        // if (I.platform() === "Surge") {
        //     // 如果存在userId，则发起请求，否则发送邮件
        //     if (obj.userId) {
        //         console.log(`userId`, obj.userId);
        //         sendRequest(obj.reference, obj.userId);
        //     } else {
        //         sendEmailLink(obj.reference);
        //     }
        // } else {
        //     // 对于非Surge环境，直接发送邮件链接
        //     sendEmailLink(obj.reference);
        // }
    } else {
        $done({body}); // 如果不符合条件，返回原始响应体
    }
} catch (e) {
    // 如果解析JSON失败，返回原始响应体
    console.log("解析错误: ", e);
    $done({body});
}