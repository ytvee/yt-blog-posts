---
title: "Why We’re Launching a Free Chrome Extension"
date: "2026-08-03"
description: "How we chose an idea and why we decided to try entering a red ocean"
tags: ["artificial intelligence", "Chrome extensions", "product thinking", "micro-products", "personal experience"]
readingTime: 4
ogImage: "https://res.cloudinary.com/dtdrbhksw/image/upload/v1785174616/page2file-converter-cube-ink_e7fi42.png"
published: true
---

<div align="center">* * *</div>

*For about a year, I watched the people behind the Telegram channel “Koroche, Kapitan — Launching Mini Apps” launch micro-products for Western markets. I used to think Chrome extensions were a strange little niche. Now a colleague and I are building page2file ourselves.*

![ogImage](https://res.cloudinary.com/dtdrbhksw/image/upload/v1785174616/page2file-converter-cube-ink_e7fi42.png)

<a id="why-an-extension"></a>

## Why an Extension

I find the way the team runs the [“Koroche, Kapitan” Telegram channel](https://t.me/its_capitan) inspiring. They launch small products for Western markets and openly share what works for them. It’s impressive, especially when you see the process itself.

- Find a problem with existing extensions
- Come up with a solution that fixes it
- Build the product
- Launch it

I never thought there was any money to be made in Chrome extensions. It seemed like a strange, tiny market that wasn’t worth pursuing. Over the course of about a year, I changed my mind and started checking in from time to time to see which extensions were appearing, what people paid for, and how those products worked.

So a colleague and I decided to give it a try. What the hell, why not? I probably could have built the whole project on my own, but it’s so much better to have someone who shares the idea. We studied the existing extensions and settled on presentation and PDF converters.

There are plenty of general-purpose converters. But almost all of them struggle with web pages. We thought it would be interesting to build a service that saves public HTML presentations as PDF and PPTX files.

We called the product [Page 2 File](https://www.page2file.com). We managed to grab the `page2file.com` domain, and it had been sitting unused. That made me uneasy, of course. It’s a great domain, yet no one had taken it. “Maybe our analysis is wrong and there’s no market here?” I thought.

But the decision had already been made. Now we need to stop thinking, build it, and see what feedback we get. Before committing to the idea, we looked at what people search for in this niche. That part matters. The point is to build products people are already looking for.

![google-image-1](https://res.cloudinary.com/dtdrbhksw/image/upload/v1785173783/opt-popularity-card-transparent_jtfmgx.webp)

Because we’re targeting Western markets, we checked the queries in Google Trends. We started our keyword research with six searches.

- `html to web`
- `web to file`
- `to pptx`
- `web to pdf`
- `web to pptx`
- `page to file`

![google-image-1](https://res.cloudinary.com/dtdrbhksw/image/upload/v1785173578/opt-region-breakdown-card-transparent_fhrahf.webp)

<a id="why-not-do-everything-at-once"></a>

## Why I Don’t Want to Build Everything at Once

The search queries show that there is interest. Building a large project straight away is risky. Even with vibe coding, you can still burn out. The process has psychological side effects. I’ve already written about some of them in [“The Risks of AI Adoption in Business: Why Efficiency May Be an Illusion”](https://www.ytdev.me/essays/The-Risks-of-AI-Implementation-in-Business-Why-Efficiency-May-Be-an-Illusion). And in my view, building a large service all at once is a pretty bad idea anyway. Users first have to figure out the interface, and the conversion rate will probably be minimal, if there is any conversion at all. The first product should be as simple as possible: open it and get something useful immediately. So we decided to split the idea into three projects.

The first converter will be very simple and free. It will take the currently open tab, preserve its layout and links, and export the result to PPTX or PDF. I’ll talk about the other projects later.

The PDF market is overcrowded, with major players already occupying the niche. But people still type `... to pdf` or `... to pptx`. They don’t type ILovePdf. Our hypothesis is that there is still room to enter the market.

We spent some time on positioning and made presentations the priority. The main advantage will be that we offer for free the features other extensions put behind a subscription.

<a id="the-idea-in-brief"></a>

## The Idea in Brief

A person opens the page they need or pastes a link to a website, chooses PDF or PPTX, clicks a button, and gets a file that preserves the layout, images, and links. Right now, we’re working on making page2file handle pages of any complexity.

<a id="why-make-it-free"></a>

## Why Make It Free

[Nielsen Norman Group](https://www.nngroup.com/articles/product-sense-definition/) connects product sense with end-to-end experience. You choose a problem, release a solution, see the result, and work out why it turned out that way. After several cycles, you develop the kind of intuition that looks innate from the outside.

I’m not really betting on this project. I see it more as practice. I want to learn how to launch products and reach financial freedom without getting tied up in businesses with huge operational overhead.

Just last year, I wrote everything by hand and didn’t pay much attention to how the project worked as a whole. Now launching a project feels like solving a Rubik’s Cube. Research + marketing + packaging + development + content + value = a successful product. You just have to keep adjusting each side until *all the colors are in the right places*. Anyone with product vision can build a project of any complexity. AI handles work that used to be limited to developers. As a developer, I now have to do the reverse: analyze the market, understand UX more deeply, and study marketing.

<a id="expectations-and-results"></a>

## Expectations and Results

We’ll launch the first version of page2file to build an audience, find out whether the product has any value, and learn what kind of UX extension users actually find convenient. Wish us luck.
