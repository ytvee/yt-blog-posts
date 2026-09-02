---
title: "What MCP Is, Why You Need It, and How It Works"
date: "2026-06-21"
description: "Today we’ll look at an important part of agent architecture—the Model Context Protocol (MCP)—and how to work with it."
tags: ["MCP", "Model Context Protocol", "AI agents", "AI for business", "business automation", "AI integration"]
readingTime: 6
ogImage: "https://res.cloudinary.com/dtdrbhksw/image/upload/v1784984598/opt-mcp_hvuino.webp"
published: true
---

This weekend, I gave a lecture at the [Academy of Business and Systems Management](https://www.akbiz.ru/about) called “How to Connect AI to Business Tools.” I keep hearing from business owners that many of them can’t keep up with new technology in the industry, so I’m continuing to clear things up. Today we’ll look at an important part of agent architecture—the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro), or MCP—and how to work with it.

**What we’ll cover:**

- [What MCP is](#what-mcp-is)
	- [Sales and CRM](#sales-and-crm)
	- [Messengers](#messengers)
	- [Online stores](#online-stores)
	- [Working with documents](#working-with-documents)
	- [Connectors or tools](#connectors-or-tools)
- [The parts of MCP](#the-parts-of-mcp)
	- [Host](#host)
	- [Client](#client)
	- [Server](#server)
	- [Summary](#summary)
- [Why MCP is popular](#why-mcp-is-popular)

<a id="what-mcp-is"></a>

## What MCP Is

**MCP** is a way to connect AI to specific business systems—cloud storage, CRM, LMS, email, and so on—so it can work with documents, requests, customers, orders, tasks, and knowledge bases, as well as perform operational actions.

In practice, it isn’t a new technology that you need to rush out and add to your infrastructure. It is simply a standardized format that different AI services and platforms use to exchange data and perform actions.

![mcp](https://res.cloudinary.com/dtdrbhksw/image/upload/v1784984598/opt-mcp_hvuino.webp)

In other words, the protocol defines how an AI service communicates with external tools: how it discovers available actions, passes parameters, calls the required function, and receives a response.

If you first want to understand how an agent differs from an ordinary chatbot, I wrote a separate article about [how AI agents work and where the term applies](/blog/what-is-the-difference-between-bots-and-agents).

<a id="sales-and-crm"></a>

### Sales and CRM

For example, if your sales run through Bitrix24 or amoCRM, an MCP server can give an agent tools to:

- find a customer
- view the history of a deal
- create a task for a manager
- change a lead’s status
- add a comment to a record

Behind the scenes, the system still works through the CRM API. The difference is that the AI sees clear business actions rather than complicated technical methods.

<a id="messengers"></a>

### Messengers

If a business talks to customers through Telegram, WhatsApp integrations, Wazzup, ChatApp, or similar services, an MCP server can allow an agent to find a conversation, draft a reply, hand the conversation over to a manager, or create a lead in the CRM.

<a id="online-stores"></a>

### Online Stores

If you run an online store, you can connect an agent to MoySklad, 1C, Etsy, Ozon Seller, Wildberries, Yandex Market, or a website built with Tilda. It could then check stock, find an order, view its payment status, update a customer record, or prepare a reply to a buyer.

<a id="working-with-documents"></a>

### Working with Documents

For documents, that could mean Google Drive, Yandex Disk, Notion, Confluence, or an internal knowledge base. The agent could find the right contract, instruction, proposal, policy, or customer data and use it in its work.

<a id="connectors-or-tools"></a>

### Connectors or Tools

Many AI tools and agent environments already support MCP. The relevant section is usually called MCP Servers or Connectors/Tools/Apps.

![mcp](https://res.cloudinary.com/dtdrbhksw/image/upload/v1782056796/codex_b70rq3.webp)

<a id="the-parts-of-mcp"></a>

## The Parts of MCP

To understand MCP without getting confused, you need to separate three parts:

1. host;
2. client;
3. server.

Yes, this is a bit dry. But without these distinctions, it’s easy to confuse an MCP server with a server in some data center—or leak sensitive data onto the internet.

![prepare](https://res.cloudinary.com/dtdrbhksw/image/upload/v1784984634/opt-model_rlhg0f.webp)

<a id="host"></a>

### Host

The host is the application where you work with AI.

It could be ChatGPT, Claude Desktop, Cursor, VS Code with an AI plugin, an internal corporate AI interface, or an agent environment that supports MCP servers.

The host is your point of entry: the chat interface where you type requests such as:

- *“Find that file for me”*
- *“Check the GitHub task”*
- *“Review the Figma design”*
- *“Prepare a short customer summary”*
- *“Create a task for the manager”*

<a id="client"></a>

### Client

The client is the component inside the [host application](#host) that maintains a connection to a specific MCP server.

An ordinary user doesn’t see the client. Technically, however, it is what maintains the connection between your AI application and a particular MCP server. One host can have either a single client or several.

For example, I work in VS Code. I have the Codex plugin installed, with different MCP servers connected for the file system, GitHub, Figma, databases, and the project’s internal documentation.

In that case, the host creates a separate MCP client for each connection:

- one client communicates with the local file-system MCP server;
- another communicates with the GitHub MCP server;
- a third communicates with the Figma MCP server;
- a fourth communicates with the server that provides access to documentation.

To me, all of this looks like a single interface. I don’t switch between clients manually. Under the hood, the host maintains several separate connections so that the agent can use different data sources and tools.

![interface](https://res.cloudinary.com/dtdrbhksw/image/upload/v1782058299/interface_fes3ek.webp)

<a id="server"></a>

### Server

An MCP server is a backend application that usually sits between a platform’s API and your host. On the platform side, it can call the API’s available functions. On the host side, it can tell the AI application:

- *“Here is the data you can read.”*
- *“Here are the actions you can perform.”*
- *“Here are the tools available to the agent.”*
- *“Here is the format for passing parameters.”*
- *“Here is what I’ll return in the response.”*

The server can run locally on your computer. For example, an MCP server for file operations could give an agent access to a specific project folder so it can:

- read files;
- search the code;
- open configuration files;
- inspect the directory structure.

![interface](https://res.cloudinary.com/dtdrbhksw/image/upload/v1782059073/desktop_wr4eda.webp)

It can also be remote. For example, an MCP server for Figma can run on Figma’s side and allow an agent to edit designs and components or post comments through the platform’s API.

**Let’s apply this to a few business cases.**

An MCP server for a CRM can give an agent the ability to:

- *“find a customer”*
- *“get a list of deals”*
- *“change a lead’s status”*
- *“create a task for a manager”*
- *“add a comment to a record”*

An MCP server for email can provide a different set of actions:

- *“find an email”*
- *“read an email thread”*
- *“draft a reply”*
- *“send an email”*
- *“find an attachment”*

For a warehouse or accounting system, an MCP server could provide the following actions:

- *“check stock levels”*
- *“find an order”*
- *“view the payment status”*
- *“get a list of shipments”*
- *“update product data”*

<a id="summary"></a>

### Summary

**Host** — the application where you work with AI;

**Client** — the internal host component that maintains a connection to a specific MCP server;

**Server** — the program that gives AI access to data and actions.

This creates certain risks for sensitive data. But a good MCP server should do the opposite: limit and structure access. Instead of exposing every API method indiscriminately, it should provide only the methods that are safe and useful for the specific tool. When choosing a server, it is therefore better to use apps approved within the AI service itself. These are usually listed as [Connectors, Tools, or Apps](#connectors-or-tools).

![interface](https://res.cloudinary.com/dtdrbhksw/image/upload/v1782061311/appss_amoan6.webp)

<a id="why-mcp-is-popular"></a>

## Why MCP Is Popular

**So why is everyone talking about MCP?**

The team at [Anthropic](https://www.anthropic.com/) put a great deal of effort into making this protocol a standard. Integrations have always been painful for engineers because every integration had to be built differently.

Anthropic created MCP to ease that pain. In December 2025, the company donated the project to the [Agentic AI Foundation under the Linux Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation). Its popularity is growing because an ecosystem is forming around the protocol: AI applications, servers, registries, SDKs, official implementations from platforms, and community servers.

[OpenAI’s documentation describes](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) how remote MCP servers and connectors can extend model capabilities. It also specifically emphasizes the need for manual confirmation before AI performs an action that could change something in an external service.

<div align="center">* * *</div>

So I don’t think it makes sense to chase every overhyped new development. With MCP, it is better to first work out where you actually need it and what it could make easier.

Sometimes ordinary automation is simpler, cheaper, and more reliable. Sometimes a data export is enough. Sometimes you need a simple webhook or a proper backend service, not an agent.
