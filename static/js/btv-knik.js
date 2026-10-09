/* Date checker for /guides/best-time-for-an-anchorage-glacier-helicopter-tour/
   (best-time-page skill, 2026-10-09).

   Tour seasons: the operators' own pages, read 2026-10-09.
   - Alaska Helicopter Tours (Knik River): landing flights year-round; glacier
     dogsledding May 1 - Aug 31; paddleboarding May 15 - Sep 15; ice climbing
     May 15 - Sep 15 and Dec 15 - Mar 31; daylight-only flying in winter.
   - Outbound Heli Adventures (Palmer): year-round flightseeing, 8 a.m. - 8 p.m.;
     Winter Ice Cave Adventure December - March.
   - Alpine Air (Girdwood): landing flights year-round except Thanksgiving and
     Christmas; glacier dogsledding May 15 - Aug 30.
   Normals: NOAA NCEI 1991-2020, Palmer Municipal Airport (USW00025331).
   Forecast: Open-Meteo, hourly, over the daylight hours, at Knik Glacier.
   Sunrise and sunset: NOAA algorithm for the Knik River base, Alaska time.
   The flying-weather words use this page's rough guide (low cloud under half
   the sky, visibility of 5 miles or more, gusts under 25 knots, no steady
   rain); only the pilot decides on the day. Typographic apostrophes only. */
(function () {
  "use strict";
  var LAT = 61.48, LON = -148.75;           /* Knik River base, for the sun */
  var FLAT = 61.43, FLON = -148.55;         /* Knik Glacier, for the forecast */
  var MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var N = [
    {hi: 22.4, lo: 8.3, rain: 0.65, wet: 6.2}, {hi: 28.3, lo: 13.2, rain: 0.70, wet: 6.1},
    {hi: 33.9, lo: 17.2, rain: 0.47, wet: 4.6}, {hi: 47.8, lo: 29.8, rain: 0.30, wet: 3.9},
    {hi: 59.1, lo: 38.8, rain: 0.62, wet: 6.7}, {hi: 65.7, lo: 46.9, rain: 1.00, wet: 8.7},
    {hi: 67.6, lo: 50.7, rain: 1.60, wet: 11.9}, {hi: 64.6, lo: 48.2, rain: 2.32, wet: 14.3},
    {hi: 55.8, lo: 40.8, rain: 2.08, wet: 13.3}, {hi: 42.3, lo: 28.6, rain: 1.25, wet: 8.9},
    {hi: 28.9, lo: 15.6, rain: 0.66, wet: 5.6}, {hi: 25.1, lo: 11.4, rain: 0.96, wet: 7.7}
  ];
  var MONTHNOTE = [
    "Midwinter: the glacier is under snow, the days are short and you need full winter clothing.",
    "Still winter, with the days lengthening quickly; ice-cave tours and winter ice climbing run.",
    "Late winter: snow on the glacier and almost 12 hours of daylight by mid-month.",
    "Spring: one of the driest months around Palmer, with snow still on the glacier and often windy days.",
    "Late spring: the summer tours start (dogsledding from May 1, paddleboarding from May 15) and the days are long.",
    "Early summer: all the summer glacier tours run, the days are the longest of the year and it is usually drier than later in the summer.",
    "High summer: all the summer glacier tours run and it is the warmest month, with rain becoming more frequent.",
    "Late summer: the summer glacier tours still run, but it is the wettest month on average around Palmer.",
    "Early fall: Southcentral Alaska’s fall colors peak, paddleboarding runs to September 15 and rain is frequent.",
    "Fall: snow returns, the summer activity tours have stopped and the days shorten quickly.",
    "Early winter: landing flights continue, with about 7 hours of daylight by mid-month.",
    "The darkest month: about 5 1/2 hours of daylight in mid-December, and Alaska Helicopter Tours flies only in daylight in winter, so there are fewer flight times."
  ];

  function md(d) { return (d.getMonth() + 1) * 100 + d.getDate(); }
  function between(n, a, b) { return n >= a && n <= b; }
  function f(x) { return Math.round(x) + "°F"; }
  function nthSunday(y, m, n) { var d = new Date(y, m, 1); while (d.getDay() !== 0) { d.setDate(d.getDate() + 1); } d.setDate(d.getDate() + 7 * (n - 1)); return d; }
  function isDST(d) { var y = d.getFullYear(); return d >= nthSunday(y, 2, 2) && d < nthSunday(y, 10, 1); }
  function thanksgiving(y) { var d = new Date(y, 10, 1); while (d.getDay() !== 4) { d.setDate(d.getDate() + 1); } d.setDate(d.getDate() + 21); return d; }
  function clock(mins) {
    mins = Math.round(mins);
    var h = Math.floor(mins / 60), m = mins - h * 60;
    var ap = h >= 12 ? "p.m." : "a.m.";
    var h12 = h % 12; if (h12 === 0) { h12 = 12; }
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  function dur(mins) { var h = Math.floor(mins / 60), m = Math.round(mins - h * 60); return h + " h " + (m < 10 ? "0" : "") + m + " min"; }
  /* NOAA approximation; returns minutes after local midnight, Alaska time. */
  function sun(d, rise) {
    var start = new Date(d.getFullYear(), 0, 1);
    var n = Math.round((d - start) / 86400000) + 1;
    var g = 2 * Math.PI / 365 * (n - 1);
    var eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var la = LAT * Math.PI / 180, z = 90.833 * Math.PI / 180;
    var ha = Math.acos(Math.cos(z) / (Math.cos(la) * Math.cos(decl)) - Math.tan(la) * Math.tan(decl)) * 180 / Math.PI;
    var utc = rise ? 720 - 4 * (LON + ha) - eqt : 720 - 4 * (LON - ha) - eqt;
    return utc - 9 * 60 + (isDST(d) ? 60 : 0);
  }

  function tours(d) {
    var k = md(d), rows = [], tg = thanksgiving(d.getFullYear());
    var alpineShut = (k === 1225) || (d.getMonth() === 10 && d.getDate() === tg.getDate());
    rows.push(["Glacier landing flights", alpineShut ? "Knik River operators fly year-round; Alpine Air in Girdwood is closed today (" + (k === 1225 ? "Christmas Day" : "Thanksgiving") + ")" : "offered every month by the Knik River and Girdwood operators"]);
    var dsK = between(k, 501, 831), dsG = between(k, 515, 830);
    rows.push(["Glacier dogsledding", dsK && dsG ? "running from the Knik River and from Girdwood" : (dsK ? (k < 515 ? "running from the Knik River (from May 1); Girdwood starts May 15" : "last day from the Knik River; Girdwood ended August 30") : "not running: summer only, May to August")]);
    rows.push(["Paddleboarding on the glacier", between(k, 515, 915) ? "running (May 15 to September 15)" : "not running: May 15 to September 15 only"]);
    var icS = between(k, 515, 915), icW = k >= 1215 || k <= 331;
    rows.push(["Ice climbing", icS ? "summer season (May 15 to September 15)" : (icW ? "winter season (December 15 to March 31), with ice-cave exploration on the GetYourGuide listing" : "not running on this date")]);
    rows.push(["Ice-cave tours", (d.getMonth() === 11 || d.getMonth() <= 2) ? "Outbound’s season, December to March; caves change and none is promised" : "not offered: December to March only"]);
    return {rows: rows, dogsled: dsK || dsG};
  }

  function renderRows(list) {
    var ul = document.getElementById("cvd-rows"); ul.innerHTML = "";
    list.forEach(function (r) {
      var li = document.createElement("li"), s = document.createElement("span"), b = document.createElement("b");
      s.textContent = r[0]; b.textContent = r[1]; li.appendChild(s); li.appendChild(b); ul.appendChild(li);
    });
  }
  function renderStats(list) {
    var ul = document.getElementById("cvd-stats"); ul.innerHTML = "";
    list.forEach(function (r) {
      var li = document.createElement("li"), b = document.createElement("b");
      b.textContent = r[0]; li.appendChild(b); li.appendChild(document.createTextNode(r[1])); ul.appendChild(li);
    });
  }
  function setCTA(dogsled) {
    var a = document.getElementById("cvd-cta"); if (!a) { return; }
    var url = dogsled ? "https://www.getyourguide.com/palmer-alaska-l156848/knik-river-glacier-dogsled-optional-helicopter-tour-t147273/"
                      : "https://www.getyourguide.com/anchorage-l978/anchorage-knik-glacier-helicopter-tour-with-landing-t147264/";
    a.textContent = dogsled ? "Check dogsled tour dates" : "Check landing flight dates";
    a.setAttribute("data-gyg-href", url);
    var dec = url;
    try { if (typeof window.gygDecorate === "function") { dec = window.gygDecorate(url); } } catch (e) { dec = url; }
    a.href = dec;
  }

  function verdictForecast(hours) {
    var good = 0;
    hours.forEach(function (h) { if (h.good) { good += 1; } });
    var share = hours.length ? good / hours.length : 0;
    if (share >= 0.6) { return "The forecast looks promising for flying: most daylight hours show little low cloud, good visibility and lighter winds. The pilot still decides on the day."; }
    if (share >= 0.3) { return "The forecast is mixed: some daylight hours look flyable and others show low cloud, wind or rain. A flight may be moved within the day or to another date."; }
    return "The forecast looks poor for flying: low cloud, poor visibility, strong gusts or rain fill most daylight hours. If your booking has free cancellation, check again before its deadline.";
  }

  function render(d) {
    var m = d.getMonth(), n = N[m];
    var rise = sun(d, true), set = sun(d, false);
    var t = tours(d);
    document.getElementById("cvd-source").textContent = "Typical " + MN[m] + " weather at Palmer";
    document.getElementById("cvd-verdict").textContent = DAYS[d.getDay()] + ", " + MN[m] + " " + d.getDate() + ", " + d.getFullYear() + ": " + MONTHNOTE[m];
    var stats = [
      [dur(set - rise), " of daylight, " + clock(rise) + " to " + clock(set)],
      [f(n.hi) + " / " + f(n.lo), "average high and low at Palmer; colder on the ice"],
      [n.rain.toFixed(2) + " in", "average rain in " + MN[m] + " at Palmer, over about " + Math.round(n.wet) + " wet days"]
    ];
    renderStats(stats);
    var rows = t.rows.slice();
    if (m === 11 || m <= 1) { rows.push(["Daylight", "short days, and Alaska Helicopter Tours flies only in daylight in winter, so there are fewer flight times"]); }
    renderRows(rows);
    setCTA(t.dogsled);

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var ahead = Math.round((d - today) / 86400000);
    if (ahead < 0 || ahead > 15 || !window.fetch) { return; }
    var day = d.getFullYear() + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + FLAT + "&longitude=" + FLON +
      "&hourly=temperature_2m,precipitation,cloud_cover_low,visibility,wind_gusts_10m" +
      "&temperature_unit=fahrenheit&wind_speed_unit=kn&precipitation_unit=inch&timezone=America%2FAnchorage" +
      "&start_date=" + day + "&end_date=" + day;
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.hourly || !j.hourly.time) { return; }
      var H = j.hourly, visFt = j.hourly_units && /ft/.test(j.hourly_units.visibility || "");
      var from = Math.max(8, Math.ceil(rise / 60)), to = Math.min(20, Math.floor(set / 60));
      var hours = [], hi = -999, rain = 0, gmax = 0, lowc = 0, vmin = 1e9;
      for (var i = 0; i < H.time.length; i++) {
        var hr = parseInt(H.time[i].slice(11, 13), 10);
        if (hr < from || hr > to) { continue; }
        var visMi = H.visibility[i] == null ? null : (visFt ? H.visibility[i] / 5280 : H.visibility[i] / 1609.34);
        var g = H.wind_gusts_10m[i] || 0, c = H.cloud_cover_low[i] || 0, p = H.precipitation[i] || 0;
        hours.push({good: c < 50 && (visMi == null || visMi >= 5) && g < 25 && p < 0.02});
        hi = Math.max(hi, H.temperature_2m[i]); rain += p; gmax = Math.max(gmax, g); lowc += c;
        if (visMi != null) { vmin = Math.min(vmin, visMi); }
      }
      if (!hours.length) { return; }
      document.getElementById("cvd-source").textContent = "Live forecast for Knik Glacier, " + clock(from * 60) + " to " + clock(to * 60);
      document.getElementById("cvd-verdict").textContent = DAYS[d.getDay()] + ", " + MN[m] + " " + d.getDate() + ": " + verdictForecast(hours);
      renderStats([
        [dur(set - rise), " of daylight, " + clock(rise) + " to " + clock(set)],
        [f(hi), "forecast high at the glacier"],
        [rain.toFixed(2) + " in", "forecast rain or snow (as water) over those hours"],
        [Math.round(gmax) + " kt", "strongest forecast gust; low cloud covers about " + Math.round(lowc / hours.length) + "% of the sky on average" + (vmin < 1e9 ? ", lowest visibility " + (vmin >= 10 ? "10+" : vmin.toFixed(1)) + " mi" : "")]
      ]);
    }).catch(function () { /* keep the averages */ });
  }

  function init() {
    var input = document.getElementById("cvd-date"); if (!input) { return; }
    var now = new Date(); now.setHours(0, 0, 0, 0);
    input.value = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    render(now);
    input.addEventListener("change", function () {
      var p = input.value.split("-"); if (p.length !== 3) { return; }
      var d = new Date(+p[0], +p[1] - 1, +p[2]); if (isNaN(d)) { return; }
      render(d);
    });
  }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
