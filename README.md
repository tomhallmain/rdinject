# rdinject

Simple extension for interfacing with Reddit DOM.

NOTE: This extension was set up for Manifest V2 only. A version for Manifest V3 is not planned.

## Setup
- Clone the repo
- Open chrome://extensions URL on Chrome browser
- Check option for developer mode
- Select `Load Unpacked`
- Select `ext` folder

## Usage

Some features are enabled by default on post load. This includes highlighting comments by users that appear in back-and-forth debates, user comments by users who are the most active on the post, and creation of buttons to vote on all of a given user's posts in the given page.

In addition, the arrow keys are mapped to specific voting goals:
- Up Arrow + Shift key - Up
- Down Arrow + Shift key - Down
- Up Arrow + Alt key - Echo
- Down Arrow + Alt key - Normalize

| Feature              | Description                                                                                                               |
|----------------------|---------------------------------------------------------------------------------------------------------------------------|
| UserPostStats        | Print a list of detailed user comment statistics from loaded DOM data, or a filtered list if a filter is set              |
| HighlightMostActive  | On post load, highlight and set counts on user comments by users who are most active on the post                          |
| GetDebates           | On post load, highlight any comments by users that appear in back-and-forth debates with a semi-unique color              |
| WordCounts           | Print to console the word counts from comments loaded on the page filtered by any filters if set, in descending order     |
| Ngrams               | Print to console the ngrams from comments loaded on the page filtered by any filters if set, in descending order          |
| Up                   | Upvote the majority of posts/comments on the page, filtered by any filters if set                                         |
| Down                 | Downvote the majority of posts/comments on the page, filtered by any filters if set                                       |
| Echo                 | Upvote the majority of posts with score > 1 and downvote the majority of posts with score < 1, filtered by filters if set |
| Normalize            | Downvote the majority of posts with score > 1 and upvote the majority of posts with score < 1, filtered by filters if set |
| Scroll               | Scroll to the first post/comment as set by a filter                                                                       |
| Next                 | Click the next button if it is present                                                                                    |
| Expand               | Expand a set of minimized comments if present, as set by filter                                                           |
| Collapse             | Collapse a set of expanded comments if present, as set by filter                                                          |
| Filter Posts by User | Sets filters for the other features - Username must match exactly                                                         |
| Filter Posts by Text | Sets filters for the other features                                                                                       |

Besides the above, most of the functionality is console-based.

