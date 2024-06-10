const headers = $request.headers; // 获取原始请求

try {
    if (headers["client-version"] && headers["banking-domain"] === "PERSONAL") {
        // 如果存在client-version和banking-domain，且banking-domain为PERSONAL
        headers["client-version"] = "1.6.5"; // 更新client-version为1.6.4
    } else if (headers["client-version"]) {
        // 如果只存在client-version
        headers["client-version"] = "2.5.5"; // 更新client-version为2.5.4
    }

    // 重新设置修改后的请求头部
    $done({headers}); // 返回修改后的请求对象
} catch (e) {
    // 如果处理过程中发生错误，打印错误信息
    console.error("处理请求头时出错: ", e);
    $done({}); // 返回原始请求对象
}
