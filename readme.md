# URL shortener

## Goal

Build a robust service (front and back) to generate a short URL from another URL (the target).

## Features

A minimal (but shiny) Single Page App must offer 2 main features:

- Create

It must be possible to type a target URL and retrieve a generated short and persistent URL.

If the target URL has been processed previously, the same short URL should be returned

- List

Last 5 cross-user generated URLs must be shown. A click on one of them should open the target in a new tab/window.

## Constraints

Front website must be fully responsive.

At least React and NodeJS must be used. You can use any library/framework on top of them.

Some parts can be written with another language if needed.

One unit test must be written.

Domain name length won't be taken into account.

## Bonuses

Show a screenshot of the target aside (or on hover) the short URL.

Use GraphQL

New URLs, created by other users, appear in the list without refreshing.

Permit user authentication. Links are still usable by anybody, but links made by authenticated users are listed only for them.

## Artifacts

The applicant must give 2 URLs to access to:

- The source code (stored in a git repository).
- A running demo (hosted online).
