<#include "common/commonHeader.ftl"/>
<div><@spring.message "common.btn.save"/></div>
<div><@spring.message "index.category.header"/></div>

<video autoplay></video>
<img class="capturedImg" src="">
<canvas style="display:none;"></canvas>
<input type="button" class="captureBtn" value="사진찍기"/>

<link type="text/css" rel="stylesheet/less" href=${resourcePath}/business/css/webRTCFilter.css>
<script type="text/javascript" src="${resourcePath}/thirdparty/jquery/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="${resourcePath}/business/js/model/webRTC.js"></script>
