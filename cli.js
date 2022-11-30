#!/usr/bin/env node

const minimist = require("minimist");
const moment = require("moment-timezone");
const fetch = require("node-fetch");

var args = minimist(process.argv.slice(2));

if(args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("-h            Show this help message and exit.");
    console.log("-n, -s        Latitude: N positive; S negative.");
    console.log("-e, -w        Longitude: E positive; W negative.");
    console.log("-z            Time zone: uses tz.guess() from moment-timezone by default.");
    console.log("-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("-j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

var timezone = moment.tz.guess()

if(args.z) {
    timezone = args.v;
}

var latitude = 0;
if (args.n && args.s) {
    console.log("Cannot specify LATITUDE twice");
    process.exit(1);
} else if (args.n) {
    latitude = args.n;
} else {
    latitude = -args.s;
}

var longitude = 0;
if (args.e && args.w) {
    console.log("Cannot specify LONGITUDE twice");
    process.exit(1);
} else if (args.e) {
    longitude = args.e;
} else {
    longitude = -args.w;
}

var url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&timezone=" + timezone;
const response = await fetch(url);
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

const days = args.d;

if (days == 0) {
    if (data.daily.precipitation_hours[days] != 0) {
        console.log("You might need your galoshes ");
    } else {
        console.log("You probably won't need your galoshes ")
    }
    console.log("today.");
} else if (days > 1) {
    if (data.daily.precipitation_hours[days] != 0) {
        console.log("You might need your galoshes ");
    } else {
        console.log("You probably won't need your galoshes ")
    }
    console.log("in " + days + " days.");
} else {
    if (data.daily.precipitation_hours[1] != 0) {
        console.log("You might need your galoshes ");
    } else {
        console.log("You probably won't need your galoshes ")
    }
    console.log("tomorrow.");
}