# Voice Order MVP Session

## Product Idea

Build a very simple voice-ordering app for a small BNB, cafe, or restaurant.

The waiter says a signature wake phrase to activate listening mode, speaks the meal order, and the app converts the speech into a kitchen order entry.

The MVP should do only this:

1. Listen for a wake phrase.
2. Capture the spoken meal order.
3. Match spoken meal names to known menu items.
4. Add the order to one general kitchen order list.

## Understanding Checklist

### 1. Problem

- [ ] The human can explain the real operational problem.
- [ ] The human can explain why the problem exists.
- [ ] The human can identify the main user branches: waiter, kitchen, manager/admin, customer.
- [ ] The human can explain why the MVP should stay narrow.

### 2. Solution

- [ ] The human can explain the basic voice-order flow.
- [ ] The human can explain why the app needs a fixed menu list.
- [ ] The human can explain why a wake phrase helps.
- [ ] The human can explain how the app should handle uncertain recognition.
- [ ] The human can explain what happens after an order is posted.

### 3. Design Decisions

- [ ] The human can explain why the MVP should use one general kitchen order list.
- [ ] The human can explain why payment, tables, inventory, analytics, and reservations are excluded from MVP.
- [ ] The human can explain the minimum data needed for each order.
- [ ] The human can explain what should be manual in version 1.

### 4. Edge Cases

- [ ] The human can explain what happens if the app hears the wrong meal.
- [ ] The human can explain what happens if two menu items sound similar.
- [ ] The human can explain what happens if the waiter changes quantity.
- [ ] The human can explain what happens if the waiter cancels before posting.
- [ ] The human can explain what happens if the restaurant is noisy.

### 5. Broader Context

- [ ] The human can explain how this saves waiter time.
- [ ] The human can explain how this reduces memory burden.
- [ ] The human can explain how this affects kitchen workflow.
- [ ] The human can explain what future features become possible after the MVP.

## Stage 1: Problem Definition

### Core Problem

In a small BNB, cafe, or restaurant, waiters often need to:

- listen to customers,
- remember several meal names,
- walk to a counter or POS,
- manually type or repeat the order,
- and avoid mistakes while serving multiple tables.

This creates wasted time and increases the chance of wrong orders.

### Why The Problem Exists

The waiter is acting as a human bridge between the customer and the kitchen system. The waiter hears the order, stores it in short-term memory, then manually transfers it into another system.

The MVP should reduce that transfer step.

### Main Branches

Waiter branch:
The waiter uses voice to create an order quickly.

Kitchen branch:
The kitchen sees a simple list of incoming orders.

Manager/admin branch:
The manager maintains the menu names the AI is allowed to recognize.

Customer branch:
The customer does not use the app directly in the MVP.

### MVP Boundary

The MVP should not try to be a full restaurant system.

For version 1, it should avoid:

- payments,
- table management,
- reservations,
- stock/inventory,
- customer profiles,
- delivery,
- loyalty points,
- advanced analytics.

The goal is to prove one thing:

Can a waiter speak a food order and get a usable kitchen order faster than typing it manually?

### How To Think About The Problem

The important pattern is:

Customer speech -> waiter memory -> manual system entry -> kitchen action

The weak point is the middle:

- Waiter memory can fail when there are many items.
- Manual entry takes time.
- Manual entry can happen late if the waiter is busy.
- The kitchen cannot act until the order reaches the list.

The MVP should test whether the app can shorten this chain:

Waiter speech -> kitchen order list

That does not mean the waiter disappears. In the MVP, the waiter still talks to the customer, checks the order, and confirms the final result.

### Why Not Build Everything First

A full restaurant system has many separate problems:

- payments need accuracy and receipts,
- table management needs floor layouts and states,
- inventory needs stock counts and ingredient rules,
- reservations need calendars and customer communication,
- analytics needs reliable historical data.

Those are useful later, but they do not prove the core voice-order idea.

The first version should answer one small business question:

Is speaking an order faster and less error-prone than typing or remembering it?

### Stage 1 Mastery Check

Before moving to solution design, the human should be able to restate:

1. The waiter currently has to remember the order and transfer it manually.
2. The business cost is slower service and more order mistakes.
3. The customer is not the first MVP user; the waiter and kitchen are.
4. The MVP should stay narrow because the first risk is whether voice ordering is useful and reliable enough.

Multiple choice check:

Which best describes the core problem?

- A. The app should manage payments, inventory, reservations, analytics, and staff scheduling immediately.
- B. The customer should talk directly to an AI chatbot instead of speaking to a waiter.
- C. The waiter should not need to memorize and re-enter orders; speech should create a kitchen order faster.

Expected mastery:

- Pick the correct option.
- Restate the problem in 1-2 sentences.
- Explain why a full POS system is too large for the first MVP.

User response log:

- Multiple choice: C. Correct.
- Restatement: skipped by user request.
- Stage 1 checklist status: verification skipped; continue with direct MVP design.

## Stage 2: Simplest MVP Design

### One-Sentence MVP

A waiter says a wake phrase, speaks an order, quickly confirms the recognized items, and the app posts the order to one shared kitchen list.

### MVP Users

Waiter:
Uses voice to create orders quickly.

Kitchen:
Views incoming orders in one general list.

Manager/admin:
Maintains the menu list so the voice system knows what items can be ordered.

Customer:
Does not use the app directly in version 1.

### Recommended Wake Phrase

Use a short phrase that is unlikely to appear naturally in conversation:

`Hey Chef`

Example:

`Hey Chef, two chicken rice, one beef noodle, one iced coffee.`

The app should not post immediately after hearing the order. It should first show what it understood and let the waiter confirm.

### Core Flow

1. Waiter opens the app on a phone or tablet.
2. App waits in idle mode.
3. Waiter says `Hey Chef`.
4. App enters listening mode.
5. Waiter says the meal names and quantities.
6. App converts speech to text.
7. App matches the text against the fixed menu.
8. App shows a confirmation screen.
9. Waiter taps `Post Order`.
10. Kitchen sees the order in the general order list.

### Version 1 Screens

Waiter screen:

- microphone status: idle, listening, processing, ready to confirm,
- recognized order items,
- quantity controls,
- remove item button,
- `Post Order` button,
- `Cancel` button.

Kitchen screen:

- general list of incoming orders,
- order number,
- time posted,
- item names and quantities,
- status: new, preparing, done.

Admin menu screen:

- list menu items,
- add item,
- edit item name,
- disable item.

### Minimum Order Data

Each posted order needs only:

- order id,
- created time,
- created by waiter name or device name,
- list of items,
- quantity per item,
- optional note,
- status.

Table number is optional. If this is for a tiny MVP, start without table numbers and use order numbers. If the business already depends on table service, add a simple optional table field.

### Fixed Menu Requirement

The AI should not freely invent food names.

It should match speech to a known menu list, for example:

- chicken rice,
- beef noodle,
- fried egg,
- iced coffee,
- orange juice.

This matters because restaurants need operational accuracy. If the app hears something uncertain, it should ask for confirmation or show the closest choices.

### Matching Logic

Use three levels:

Exact match:
The speech clearly matches a menu item.

Close match:
The speech sounds similar to one menu item. Show it for confirmation.

Unclear match:
The speech could mean multiple items or no known item. Do not post automatically.

Example:

The waiter says:

`one chicken rise`

The app should suggest:

`1 x chicken rice`

Then the waiter confirms or edits.

### Edge Cases

Wrong recognition:
Show the recognized items before posting. The waiter can edit or cancel.

Similar item names:
If the menu has `chicken rice` and `chicken fries`, the app should ask the waiter to choose.

Quantity changes:
The waiter can say the quantity again or use plus/minus buttons before posting.

Canceling:
The waiter can say `cancel order` or tap `Cancel` before posting.

Noisy room:
The app should use confirmation and avoid automatic posting. Headset support can be added later.

Out-of-menu item:
The app should show `Unknown item` and let the waiter manually select from the menu.

Partial order:
The waiter can post what is confirmed, or cancel and restart.

Duplicate wake phrase:
If the app is already listening, ignore the second wake phrase.

Kitchen offline:
Keep the order locally as `pending sync` and post when connection returns.

### What The MVP Should Exclude

Exclude these from version 1:

- payment,
- receipts,
- inventory,
- reservations,
- customer accounts,
- delivery,
- table map,
- discounts,
- loyalty,
- detailed analytics,
- AI recommendations.

These features are useful later, but they increase complexity before the core risk is proven.

## Stage 3: Product Decisions

### Main Design Decision

The app should be a voice input layer plus a kitchen list.

It should not try to become a full POS at the start.

### Why One General Kitchen List

One general list is enough to prove the MVP:

- waiters can post orders,
- kitchen can see them,
- orders can move from new to preparing to done.

Separate stations, table maps, and routing rules can come later.

### Why Confirmation Is Required

Voice recognition can fail because of accents, noise, similar menu names, or rushed speech.

For food orders, a wrong item has a real cost. Confirmation keeps the waiter responsible for the final order while still reducing typing and memory burden.

### Recommended MVP Tech Shape

Frontend:

- simple web app,
- phone/tablet friendly,
- waiter screen and kitchen screen.

Backend:

- small API for menu items and orders,
- database table for menu,
- database table for orders.

Voice:

- browser speech recognition or mobile speech-to-text for prototype,
- later upgrade to a stronger speech model if accuracy is weak.

AI/menu parser:

- convert transcript into structured items,
- match only against the known menu,
- return confidence and alternatives.

### Example Structured Output

Speech:

`Hey Chef, two chicken rice and one iced coffee`

Parsed order:

```json
{
  "items": [
    {
      "menu_item": "chicken rice",
      "quantity": 2,
      "confidence": 0.94
    },
    {
      "menu_item": "iced coffee",
      "quantity": 1,
      "confidence": 0.91
    }
  ],
  "needs_confirmation": true
}
```

### Success Metrics

The MVP is working if:

- waiter can create an order faster than manual entry,
- kitchen receives the order clearly,
- waiter can fix recognition mistakes before posting,
- fewer orders are forgotten or delayed,
- staff can use it with minimal training.

### First Prototype Scope

Build only:

1. Menu setup.
2. Voice capture.
3. Transcript-to-menu matching.
4. Confirmation screen.
5. General kitchen order list.
6. Basic order status updates.

### Future Features After MVP

Add later only if the MVP works:

- table numbers,
- waiter accounts,
- kitchen stations,
- payment/POS integration,
- inventory deduction,
- sales analytics,
- multi-language support,
- headset mode,
- direct customer ordering,
- recommendations and upsell prompts.

## Open Questions

- What wake phrase should activate listening mode?
- Should the waiter confirm every recognized order before posting?
- Does the MVP need table numbers, or should it start with only order numbers?
- Will the menu be small enough to manually enter at first?

## Recommended Answers To Open Questions

- Wake phrase: use `Hey Chef`.
- Confirmation: yes, always confirm before posting.
- Table numbers: optional; start with order numbers unless the restaurant needs table service on day one.
- Menu setup: manual entry is fine for MVP.

## Stage 4: MVP Build Started

Implemented a local browser prototype.

Files:

- `index.html`: app layout with Waiter, Kitchen, and Menu views.
- `styles.css`: responsive operational UI styling.
- `app.js`: voice capture, wake phrase handling, menu matching, draft confirmation, order posting, kitchen statuses, and menu editing.
- `server.js`: tiny local Node server.
- `README.md`: local run instructions.

Built scope:

- wake phrase: `Hey Chef`,
- voice order capture when browser speech recognition is available,
- typed transcript fallback,
- fixed menu matching,
- confidence/review display,
- quantity adjust and item removal before posting,
- order note,
- one shared kitchen order list,
- statuses: new, preparing, done,
- menu add/disable/delete,
- phone access over the same local Wi-Fi through the Node server,
- shared local orders and menu through `shop-data.json`,
- browser-local fallback with `localStorage`,
- device name and order label fields for real shop handoff,
- phone-friendly layout with larger touch controls and bottom navigation,
- phone keyboard dictation fallback when browser microphone APIs are blocked.

Not built yet:

- cloud backend/database,
- internet sync across locations,
- payment,
- table map,
- reservations,
- inventory,
- analytics,
- user accounts.

## Stage 5: Mini Revenue Summary

Implemented a local revenue page for shop-day totals.

Understanding checklist:

- [x] Problem: kitchen cleanup used to remove finished orders, which would make daily revenue incomplete.
- [x] Solution: `Xóa món xong` now hides finished orders from the kitchen board but keeps them in `shop-data.json`.
- [x] Solution: menu items now carry size-based prices from the provided Tram Cafe menu image.
- [x] Solution: new orders store `unitPrice` at post time so later menu-price changes do not rewrite old revenue.
- [x] Impact: order cards stay clean for staff and kitchen; prices appear only in the `Doanh thu` tab.
- [x] Edge case: older orders without `unitPrice` try to use the current menu price by item id/name and size.
- [x] Edge case: items with only one listed size fall back to their available menu price.

Files changed:

- `index.html`: added `Doanh thu` tab and summary page.
- `styles.css`: added mobile-friendly revenue summary styling.
- `app.js`: added menu prices, revenue rendering, date filtering, and non-destructive kitchen cleanup.
- `server.js`: added server-side price lookup and stored `unitPrice` on new orders.
- `README.md`: documented local revenue behavior.

## Stage 6: Editable Recognition Words

Implemented editable menu aliases for shorthand voice orders.

Understanding checklist:

- [x] Problem: staff could see recognition words in the Menu tab, but could not edit them without changing code.
- [x] Solution: each menu item now has a `Từ nhận diện món` editor that accepts comma-separated or newline-separated aliases.
- [x] Solution: `PATCH /api/menu/:id` now saves aliases to `shop-data.json` so other local devices can sync them.
- [x] Edge case: exact duplicate aliases are removed while preserving separate accented/non-accented shorthand if staff wants both visible.
- [x] Impact: the shop can teach the app local shorthand like `nâu đá`, `cf sữa`, or abbreviations while staying fully local.

## Stage 7: Demo Preparation

Created `DEMO_CHECKLIST.md` as the pre-demo operating checklist.

Understanding checklist:

- [x] Problem: a successful owner demo needs proof of real shop flow, not just proof that the app opens.
- [x] Solution: test phone access, text parsing, phone keyboard dictation, menu alias editing, kitchen status movement, non-destructive cleanup, and daily revenue.
- [x] Demo decision: lead with one complete order from phone to kitchen to revenue before showing settings.
- [x] Edge case: keep a fallback path for microphone issues by using the phone keyboard mic or typed transcript.
- [x] Broader context: be honest that the MVP is local order/kitchen/revenue only, not POS, inventory, staff accounts, or cloud sync yet.

## Stage 8: No-Connector Parsing And Own Bottle Discount

Implemented parser and revenue refinements for more realistic shop speech.

Understanding checklist:

- [x] Problem: staff may say multiple items back-to-back without saying `và`.
- [x] Solution: parser now relies on menu term positions and supports shorthand anchors like `cà phê sữa` and `trà lài`.
- [x] Problem: quantity from a previous item could be reused by a later item if no new quantity was spoken.
- [x] Solution: quantity is read only when it sits directly before the menu term, optionally followed by `ly`/`cốc`; otherwise default is 1.
- [x] Problem: menu alias inputs could be overwritten by background server sync while staff was typing.
- [x] Solution: menu render is paused while an alias editor is focused.
- [x] Solution: `bình riêng`/`bình cá nhân`/`trong bình` style phrases are stored as `ownBottle`.
- [x] Impact: own-bottle items show a kitchen note, reduce revenue by `2.000đ`, count in the own-bottle total, and do not count toward S/M/L cup usage.

## Stage 9: Edit Existing Orders

Implemented a simple edit flow for customer-requested changes after an order has been sent.

Understanding checklist:

- [x] Problem: previously a customer change required creating a new order or manually reasoning around the old one.
- [x] Solution: each kitchen order card has a `Sửa` button that loads the existing order back into the waiter draft.
- [x] Solution: the main submit button changes from `Gửi bếp` to `Cập nhật order` while editing.
- [x] Solution: updating uses `PATCH /api/orders/:id`, keeps the same order id, recalculates item price fields, and marks the order as edited.
- [x] Operational decision: edited orders return to the `Mới` column so the kitchen sees the change.
- [x] Impact: revenue follows the edited order instead of double-counting a replacement order.

## Stage 10: Additive Edit Parsing

Refined editing behavior for natural customer changes.

Understanding checklist:

- [x] Problem: while editing an existing order, parsing a new spoken item replaced the whole draft and could remove other existing items.
- [x] Solution: in edit mode, parsed items are merged into the current draft instead of replacing it.
- [x] Solution: duplicate detection uses the menu item id/name, so saying a menu item that already exists in the draft does not add another line.
- [x] Workflow: to replace one drink, staff removes that drink from the draft, speaks/types the new drink, presses `Tách món`, then presses `Cập nhật order`.
- [x] Impact: customer changes can be made without recreating the whole order and without double-counting revenue.

## Stage 11: Kitchen And Waiter UI Cleanup

Adjusted UI for the current demo flow.

Understanding checklist:

- [x] Problem: kitchen was showing newest orders first, which did not match first-come-first-served shop flow.
- [x] Solution: each kitchen status column now sorts orders by ascending order number.
- [x] Problem: voice controls were distracting during the current demo.
- [x] Solution: waiter UI temporarily hides wake phrase and voice controls while keeping text parsing.
- [x] Solution: transcript text entry is visually separated with a black border.
- [x] Solution: `Xóa món xong` moved into the `Xong` kitchen column above its heading.

## Stage 12: Text-Only Waiter Entry Layout

Corrected the waiter layout to fully remove visible voice-order controls for the current demo.

Understanding checklist:

- [x] Problem: previous UI still looked like a voice panel with hidden controls and only the textarea itself boxed.
- [x] Solution: visible waiter input now has only `Nhập món`, the text box, `Tách món`, and `Xóa`.
- [x] Solution: the whole `Nhập món` panel is visually separated with a darker border and tinted background.
- [x] Impact: the two staff-facing sections are now clearly `Nhập món` and `Order nháp`.

## Stage 13: Two-State Kitchen Flow

Simplified the kitchen board for the current shop workflow.

Understanding checklist:

- [x] Problem: the `Đang làm` column and button added an extra step that staff did not need for the demo.
- [x] Solution: kitchen now renders only `Mới` and `Xong`.
- [x] Solution: each order card now shows only `Sửa`, `Mới`, and `Xong`.
- [x] Edge case: old orders with `preparing` status are treated as `Mới` in the kitchen UI so they do not disappear.
- [x] Impact: the kitchen flow is now faster: make drinks from `Mới`, then mark them `Xong`.

## Stage 14: Clear Kitchen Sections And Top Scroll

Made the kitchen page easier to operate on a phone during a busy shift.

Understanding checklist:

- [x] Problem: the two kitchen statuses existed, but the visual separation was still too soft for quick scanning.
- [x] Solution: `Mới` and `Xong` now render as separate bordered sections with distinct headers and order counts.
- [x] Problem: after sending an order, the page could remain scrolled down and hide the top of the kitchen queue.
- [x] Solution: switching to the kitchen view now always scrolls to the top; this also covers the `Gửi bếp` flow.
- [x] Impact: staff can immediately see the first orders in `Mới` without manual scrolling.

## Stage 15: Direct Mic And Delete Order

Started moving the waiter flow from keyboard dictation toward an in-app mic flow.

Understanding checklist:

- [x] Problem: using the phone keyboard mic is slow because staff must focus the text box, wait for dictation, then press parse.
- [x] Solution: the waiter screen now has a large `Nói món` button that starts direct speech recognition and auto-parses the transcript.
- [x] Decision: wake-word listening stays hidden for now; the MVP path is one tap, one short phrase, review draft, send kitchen.
- [x] Edge case: if too many transcript words are unknown, the app shows `Không nghe rõ` and does not create a risky draft.
- [x] Edge case: in edit mode, an unclear new phrase does not erase the current draft.
- [x] Solution: editing an order now exposes `Xóa order`, which removes the order from kitchen and daily revenue.
- [x] Impact: direct mic still depends on browser microphone permission; on phone over HTTP, Chrome may require an HTTPS local setup.

## Stage 16: Revenue By Sale Date

Added explicit sale-date tracking so revenue can be recorded for different days.

Understanding checklist:

- [x] Problem: revenue previously grouped orders by `createdAt`, so a late/backfilled order could only count toward the day it was entered.
- [x] Solution: each order now has a `Ngày bán` field stored as `businessDate`.
- [x] Solution: the revenue page filters by `businessDate`; older orders without it fall back to `createdAt`.
- [x] Solution: editing an order also lets staff correct its sale date.
- [x] Impact: the shop can enter orders for hôm nay, hôm qua, or another selected date and still get a correct daily total.

## Stage 17: Mobile Mic Auto-Parse Fallback

Made direct mic parsing more reliable on phone browsers.

Understanding checklist:

- [x] Problem: Chrome on phones can show interim transcript text but never mark it as final quickly enough for the old auto-parse path.
- [x] Solution: when `Nói món` is active and transcript text stops changing briefly, the app now stops the mic and parses the current transcript.
- [x] Solution: the recognition `onend` handler also parses the visible transcript if no final event was received.
- [x] Edge case: duplicate parse is prevented by remembering the last transcript parsed in the current mic session.
- [x] Impact: staff should see `Order nháp` after speaking without pressing `Tách món`.

## Stage 18: Faster Mic Split And Softer Order Cells

Tuned the order display and mic timing for faster shop use.

Understanding checklist:

- [x] Problem: `1 x Phin Sữa Đá` was visually noisy for the kitchen.
- [x] Solution: kitchen item quantity now renders as `1 Phin Sữa Đá`.
- [x] Problem: mic auto-split waited too long after staff stopped talking.
- [x] Solution: the idle wait before auto-splitting is now `1` second.
- [x] Solution: item name, taste, and ice cells now use distinct soft colors for faster scanning without harsh contrast.

## Stage 19: Alternating Kitchen Order Cards

Made separate kitchen orders easier to distinguish at a glance.

Understanding checklist:

- [x] Problem: multiple order cards in the same kitchen column could blend together visually.
- [x] Solution: each order card now gets one of six soft color tones based on its order number.
- [x] Design decision: colors are applied to the full card plus a stronger left border, while item cells keep their own softer category colors.
- [x] Tuning: order card backgrounds were made slightly stronger after phone review.
- [x] Impact: `ORD-0001`, `ORD-0002`, and `ORD-0003` are easier to scan without making the kitchen screen too bright.

## Stage 20: Menu-Aware Size Mapping

Corrected size words based on the actual sizes available for each drink.

Understanding checklist:

- [x] Problem: the parser treated `lớn` as `L` for every item, which was wrong for drinks that only have `S` and `M`.
- [x] Solution: size words are now normalized against an explicit per-item size table from the shop menu.
- [x] Rule: if a drink only has `S` and `M`, `nhỏ` maps to `S`, while `vừa` and `lớn` map to `M`.
- [x] Rule: if a drink only has `M` and `L`, `nhỏ` and `vừa` map to `M`, while `lớn` maps to `L`.
- [x] Edge case: one-size drinks use their only available size regardless of the spoken size word.
- [x] Correction: `Trà Oolong Cold Brew Vị Mơ Đào` is treated as `L` only.
- [x] Impact: kitchen size badges and revenue prices now match the real menu sizes more closely.

## Stage 21: Cloud Deployment Path

Prepared the app for cloud hosting so the shop can use one HTTPS link without a laptop server.

Understanding checklist:

- [x] Problem: local usage requires a laptop running `node server.js`, and phone microphone support is weaker over local HTTP.
- [x] Solution: `server.js` now reads `process.env.PORT`, which cloud providers require.
- [x] Solution: `SHOP_DATA_FILE` can point to a persistent cloud disk path.
- [x] Solution: `shop-data.json` is blocked from static serving so order data is not exposed as a public file.
- [x] Solution: `/api/health` was added for cloud health checks.
- [x] Solution: `package.json`, `render.yaml`, `.gitignore`, and `CLOUD_DEPLOY.md` were added.
- [x] Tradeoff: using a persistent disk on Render may require a paid plan; without persistence, data may reset on restart.

## Stage 22: Voice Shortcut Language Design

Started designing solution 1: a fixed shop-specific voice ordering language.

Understanding checklist:

- [x] Problem: fully natural speech is too unreliable during crowded shifts because noise, speed, accent, and filler words create too many variables.
- [x] Product decision: make staff speak in a short fixed pattern instead of expecting AI to understand every natural sentence.
- [x] Solution artifact: `VOICE_SHORTCUT_DESIGN.md` defines the order grammar, option vocabulary, and a fill-in worksheet for menu shortcuts.
- [x] Design decision: owner and staff must fill the approved dish shortcuts together because they know the real words used during service.
- [x] Edge case: every menu item should have one primary shortcut and only a few approved secondary shortcuts to avoid confusion.
- [x] Impact: once the shortcut table is filled, the parser can be made stricter, faster, and less error-prone.

## Stage 23: Stronger Ice Note Recognition

Fixed ice-note recognition for spoken phrases like `ít đá` and `nhiều đá`.

Understanding checklist:

- [x] Problem: staff could say ice notes, but the order could still show the default `vừa`.
- [x] Solution: ice-note phrases now include both normal and reversed forms, such as `ít đá`, `đá ít`, `nhiều đá`, and `đá nhiều`.
- [x] Solution: if staff says two ice notes while correcting themselves, the parser uses the last one spoken.
- [x] Impact: the third order column should now record `ít đá` or `nhiều đá` more reliably.

## Stage 24: Voice Split And Send Commands

Added voice commands for hands-free order flow during busy service.

Understanding checklist:

- [x] Problem: staff may not have time to tap `Tách món` or `Gửi bếp` while taking orders continuously.
- [x] Solution: while direct mic is active, saying `xong` immediately splits the current spoken segment into `Order nháp` and keeps listening.
- [x] Solution: saying `gửi`, `gửi bếp`, `ok`, or `okay` sends the current draft to the kitchen.
- [x] Solution: if a staff member says more item text before `gửi`, the app parses that segment before sending.
- [x] Design decision: voice-send keeps the waiter on the staff screen and keeps the mic session ready for the next order.
- [x] Edge case: Chrome can emit interim and final transcripts for the same phrase, so command processing ignores duplicate late results briefly.
- [x] Product decision: silence no longer splits an order; staff must say the configured split keyword.

## Stage 25: Voice Draft Editing

Extended the continuous mic session so staff can correct the draft without touching the phone.

Understanding checklist:

- [x] Desired flow: tap mic once, speak the order, visually check the draft, then use voice commands to edit and send.
- [x] Solution: `tăng [món]` increases quantity in the draft.
- [x] Solution: `giảm [món]` decreases quantity in the draft and removes the line if quantity reaches zero.
- [x] Solution: `xóa [món]` removes that menu item from the draft.
- [x] Solution: `thêm [món]` parses the named item and adds it to the draft; if it already exists, its quantity increases.
- [x] Solution: `đổi [món cũ] thành [món mới]` replaces a draft item by voice.
- [x] Solution: `order 1, đổi cafe đen thành cafe sữa` can edit an order that has already been sent to the kitchen.
- [x] Solution: the Menu tab now includes editable recognition words for split, send, increase, decrease, remove, add, and replace commands.
- [x] Edge case: edit commands only activate when they start the phrase and the following words match a menu item, reducing conflict with normal order words like `thêm đá`.
- [x] Impact: after the initial phone check, staff can correct and submit the order by voice.

## Stage 26: Duplicate Speech Guard

Fixed repeated transcript text when Chrome emits the same speech segment multiple times.

Understanding checklist:

- [x] Problem: Web Speech can resend old final/interim transcript chunks, so appending every chunk directly can repeat the whole spoken phrase several times.
- [x] Solution: the mic layer now collapses adjacent repeated speech blocks before parsing.
- [x] Solution: final transcript is appended by overlap, so if the browser sends `sữa nhỏ` then later sends `sữa nhỏ trà lài`, only `trà lài` is added.
- [x] Solution: interim preview detects when the browser already returned the committed words and avoids prefixing them again.
- [x] Edge case: repeated exact phrases like `sữa nhỏ sữa nhỏ sữa nhỏ` collapse to one phrase, while normal different items can still be added.
- [x] Impact: order parsing receives cleaner text, so draft items should not multiply just because the mic repeated the transcript.

## Stage 27: Sent Order Voice Edit Recognition

Made voice editing for already-sent kitchen orders match real phone speech better.

Understanding checklist:

- [x] Problem: staff might say `order 1`, but phone speech recognition can return `order một`, `oder một`, or `ô đờ một`.
- [x] Problem: the old sent-order command matcher only accepted numeric digits, so many valid spoken commands never reached the order edit logic.
- [x] Solution: sent-order voice commands now accept spoken order numbers such as `một`, `hai`, `mười hai`, and `hai mươi ba`.
- [x] Solution: the matcher accepts natural variants like `order`, `oder`, `ô đờ`, `đơn`, `đơn số`, and `đơn hàng`.
- [x] Solution: staff can say `order mới nhất ...` or `order vừa gửi ...` to edit the newest sent order without remembering the exact number.
- [x] Edge case: if saving the edited order fails, the mic reports the failure and keeps listening instead of getting stuck.
- [x] Impact: commands like `order một đổi cafe đen thành cafe sữa` should update the kitchen order directly.

## Stage 28: Confirmed Voice Editing For Sent Orders

Changed sent-order voice editing from immediate save to staged editing.

Understanding checklist:

- [x] Problem: directly saving after the first voice edit made it hard for staff to make multiple corrections in one pass.
- [x] Solution: voice commands like `order 23 đổi cafe đen thành cafe sữa` now load that sent order into the draft editor and apply the change locally first.
- [x] Solution: the mic keeps listening after each edit, so staff can continue with `thêm`, `xóa`, `tăng`, `giảm`, or `đổi`.
- [x] Solution: saying `xong` while an existing order is being edited updates the kitchen order.
- [x] Solution: saying `xóa order 23` deletes the whole order from the kitchen and revenue data.
- [x] Edge case: if the edited order has no items left, the app asks staff to use `xóa order [số]` instead of saving an empty order.
- [x] Impact: sent-order correction now matches a real service flow: select order by voice, make one or more edits, then confirm once.
