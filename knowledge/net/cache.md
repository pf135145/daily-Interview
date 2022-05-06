## http 缓存

### 简介

> http 的缓存都是从资源的第二次请求开始的，因为首次请求都是新的资源。
> 
> 浏览器 http 缓存可以分为**强缓存**和**协商缓存**。

强缓存和协商缓存的区别是：

* 命中强缓存，请求不会发送到服务器，此时 http 状态码为200
* 如果没有命中强缓存，则发送请求到服务器，若命中协商缓存，则返回304状态码

下表所列缓存按照优先级进行排序：

| 字段名称 | 字段分类 |
|------ |-------- |
|Pragma| 请求头&响应头 |
|Cache-Control| 请求头&响应头 |
| Expires | 响应头 |
|If-None-Match / ETag|请求头 / 响应头|
|If-Modified-Since / Last-Modified|请求头 / 响应头|

### 强缓存

强缓存在未失效的情况下（即 Cache-Control 的值没有过期或者 Expires 的缓存时间没有过期），那么就会直接使用浏览器的缓存数据，不会再向服务器发送任何请求。强制缓存生效时，http 状态码为 200。

#### Pragma

Pragma 是一个在 HTTP/1.0 中规定的通用首部，它在响应头的行为没有规范，依赖于浏览器的实现，建议只在需要兼容 HTTP/1.0 客户端的场合下应用。参数只有一个：no-cache，会通知浏览器不直接使用强缓存，因为它优先级最高，当存在时一定不会命中强缓存。

#### Cache-Control 

Cache-Control 也是 HTTP/1.1 控制浏览器缓存的主流字段，被用于在请求和响应中。请求头和相应头指令略有不同，这里列举几个常见的指令：

* max-age：设置缓存存储的最大周期，超过这个时间缓存被认为过期（单位秒）。
* s-maxage：会覆盖max-age或者Expires头，但是仅适用于共享缓存
* public：响应头专有，可以被所有的用户缓存，包括终端用户和 CDN 等中间代理服务器
* private：响应头专有，只能被终端用户的浏览器缓存，不允许 CDN 等中继缓存服务器对其缓存
* no-cache：不触发强缓存，此时会触发协商缓存
* no-store：禁止使用缓存，每一次都要重新请求数据

#### Expires

Expires 是一个响应首部字段，它指定了一个日期/时间（值为GMT时间，即格林尼治时间），在这个时间/日期之前，缓存被认为是有效的。如果在 Cache-Control 响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。

### 协商缓存

当 Cache-Control 和 Expires 过期或者 Cache-Control 的属性设置为 no-cache 时，那么此时浏览器就会发送请求与服务器进行协商，服务器端对比判断资源是否进行了修改更新。如果资源没有修改，那么就会返回 304 状态码，告诉浏览器可以使用缓存中的数据，减少服务器的数据传输压力。

#### If-None-Match / ETag

Etag是服务器响应请求时，返回当前资源文件的一个唯一标识，通常是文件内容的哈希值，只要资源有变化，Etag就会重新生成

> 浏览器在第一次访问资源时，服务器返回资源的同时，服务器会在 response header 中添加 Etag 字段


#### If-Modified-Since / Last-Modified

Last-Modified 是一个响应首部字段，包含该资源上次修改的时间。 

> 浏览器在第一次访问资源时，服务器返回资源的同时，服务器会在 response header 中添加 Last-Modified

#### Last-Modified弊端

* 只能以秒计时，如果在1s内修改完成文件，服务端会认为资源没有修改

#### Last-Modified \ Etag 两者之间对比

### from memory cache 与 from disk cache

* 对于大文件来说，大概率是不存储在 memory cache 中的，反之优先
* 当前系统内存使用率高的话，文件优先存储进 disk cache
* 一般 js 文件和图片会放到 memory cache ，css 放在 disk cache

> 脚本却可能随时会执行，如果脚本在磁盘当中，在执行该脚本需要从磁盘中取到内存当中来。这样的IO开销是比较大的，有可能会导致浏览器失去响应。因此，脚本一般在内存中

### Service Worker 缓存

Service Worker 是一种专门用于浏览器与网络和/或缓存之间的代理。

与常规的 Web Worker 不同，Service Worker 具有一些额外的功能，使他们可以实现其代理目的。一旦安装并激活它们，Service Worker 就可以拦截从页面文档发出的任何网络请求。

Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的 