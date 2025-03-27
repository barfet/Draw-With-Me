Okay, here is a Product Requirements Document (PRD) for the "Draw With Me" AI Art Buddy application, designed to be quick, focused on the MVP, and aligned with the technical stack mentioned (React, OpenAI).

---

**Product Requirement Document: Draw With Me - AI Art Buddy (MVP v1.0)**

**1. Introduction**

*   **Project Name:** Draw With Me - AI Art Buddy
*   **Goal:** To create a simple, engaging web application where children can create doodles, optionally using templates, and have an AI transform their creations into more detailed images. The application should be intuitive for young users and allow them to save or share their artwork.
*   **Target Audience:** Children (approx. ages 5-10) and their parents.
*   **Success Metric (MVP):** Users can successfully create a doodle, generate an AI image based on it, and download the result. Positive user feedback on ease of use and fun factor.

**2. Goals (MVP)**

*   Provide a basic digital drawing canvas accessible via a web browser.
*   Integrate OpenAI's image generation capabilities (e.g., DALL·E) to enhance user doodles.
*   Offer a small set of predefined templates as starting points.
*   Allow users to download their final AI-generated artwork.
*   Ensure a simple, intuitive, and safe user experience for children.
*   Validate the core concept and technical feasibility.

**3. User Personas**

*   **Creative Kid (Leo, Age 7):** Loves drawing simple shapes, animals, and monsters. Gets excited by seeing his ideas come to life. Needs large buttons, simple tools, and quick, visually rewarding feedback. Doesn't have patience for complex interfaces.
*   **Parent (Sarah, Leo's Mom):** Wants safe, creative digital activities for Leo. Appreciates apps that are easy for him to use independently. Wants assurance that the content generated is child-appropriate. Might help Leo print or share his creations.

**4. User Stories & Functional Requirements**

**Story 1: Basic Doodling**

*   **As a:** Creative Kid (Leo)
*   **I want to:** Draw freely on a blank digital canvas using a simple pen tool and select different colors.
*   **So that:** I can create my own unique picture from scratch.
*   **Acceptance Criteria:**
    *   A white canvas area is displayed upon loading the app.
    *   A pen tool is available and selected by default.
    *   A basic color palette (e.g., 8-12 common colors) is visible.
    *   Clicking/tapping a color changes the pen tool's color.
    *   Clicking and dragging (or tapping and dragging on touch devices) on the canvas draws a line in the selected color.
    *   An eraser tool is available to remove parts of the drawing.
    *   A "Clear Canvas" button exists to start over.
*   **Test Cases:**
    *   Verify canvas loads.
    *   Draw lines with the default color.
    *   Select a different color and draw lines; verify color change.
    *   Use the eraser tool to remove parts of lines.
    *   Draw something, click "Clear Canvas," verify canvas is empty.

**Story 2: Use Drawing Templates**

*   **As a:** Creative Kid (Leo)
*   **I want to:** Choose a simple outline template (like a cat or a robot).
*   **So that:** I have a starting point for my drawing and can color it in or add details.
*   **Acceptance Criteria:**
    *   A button/area exists to select a template.
    *   A small selection of templates (e.g., Cat, Robot, Flower - 3 for MVP) is presented upon clicking the template button.
    *   Selecting a template loads its outline onto the canvas.
    *   The user can draw/color "on" the template (template lines should remain visible).
    *   The "Clear Canvas" button removes both the user's drawing and the template.
*   **Test Cases:**
    *   Verify template selection UI is present.
    *   Select the "Cat" template; verify outline appears on canvas.
    *   Draw inside/around the cat outline.
    *   Clear canvas; verify template and drawing are gone.
    *   Select "Robot" template; verify it loads.

**Story 3: AI Image Generation**

*   **As a:** Creative Kid (Leo)
*   **I want to:** Press a magic "Generate" button after I finish my doodle.
*   **So that:** The computer can turn my drawing into a cool, detailed picture based on my idea.
*   **Acceptance Criteria:**
    *   A clearly visible "Generate Art" button exists.
    *   Clicking the button sends the current canvas content (doodle + template if used) to the AI backend.
    *   A loading indicator is displayed while the AI is processing.
    *   The AI-generated image is displayed clearly within a reasonable time (e.g., < 15 seconds).
    *   The generated image visually relates to the user's doodle/template content.
    *   The original doodle remains visible for comparison (e.g., side-by-side or toggle).
    *   Basic error handling is implemented (e.g., message if AI fails).
*   **Test Cases:**
    *   Draw a simple shape (e.g., a rough sun), click Generate; verify output looks like a more detailed sun.
    *   Use the "Cat" template, color it blue, click Generate; verify output is a detailed cat, possibly blue, in a style consistent with the prompt.
    *   Click Generate on an empty canvas; verify appropriate handling (e.g., disabled button or user message).
    *   Simulate an API error; verify a user-friendly error message is shown.

**Story 4: Download Artwork**

*   **As a:** Creative Kid (Leo) or Parent (Sarah)
*   **I want to:** Save the final AI-generated picture to my device.
*   **So that:** I can keep it, print it later, or share it with family.
*   **Acceptance Criteria:**
    *   A "Download" button is available *after* an AI image has been successfully generated.
    *   Clicking "Download" initiates a file download of the *AI-generated image* (e.g., as a PNG or JPG file).
    *   The downloaded file is reasonably high quality for viewing or basic printing.
*   **Test Cases:**
    *   Generate an AI image.
    *   Click the Download button.
    *   Verify a file (e.g., `art.png`) is downloaded.
    *   Open the file and verify it is the generated AI image.

**5. Non-Functional Requirements**

*   **Usability:** Extremely simple interface. Large, clear buttons/icons. Minimal text. Intuitive workflow. Responsive design for common tablet/desktop resolutions.
*   **Performance:** Canvas drawing should feel immediate. AI generation target: < 15 seconds.
*   **Security & Safety:**
    *   **NO** collection of Personally Identifiable Information (PII) from children.
    *   Backend service must securely store and use the OpenAI API key (NOT exposed in the frontend).
    *   Implement content safety features available via OpenAI API to prevent generation of inappropriate content. Add negative prompts (e.g., "no scary, violent, nsfw content") in the backend API call.
*   **Cost:** Monitor OpenAI API usage. Implement basic checks (e.g., disable generate button briefly after use) if needed to prevent accidental rapid-fire requests.
*   **Accessibility:** Basic considerations (e.g., sufficient color contrast, clear focus indicators) are encouraged but deep WCAG compliance is out of scope for MVP.

**6. System Architecture (High-Level)**

*   **Frontend:**
    *   **Framework:** React
    *   **Canvas:** HTML Canvas API directly or a simple library (e.g., `react-konva`, `fabric.js` - evaluate based on ease of use for basic drawing and exporting image data).
    *   **State Management:** React Context API or Zustand (keep it lightweight).
    *   **Deployment:** Static hosting (e.g., Vercel, Netlify, GitHub Pages).
*   **Backend:**
    *   **Platform:** Serverless Function (e.g., Vercel Serverless Functions, AWS Lambda, Netlify Functions) or simple Node.js/Express server.
    *   **Purpose:**
        1.  Receive image data (e.g., base64 string) from the frontend.
        2.  Securely call the OpenAI API using the stored API key.
        3.  Construct the appropriate prompt for OpenAI (e.g., "Create a detailed, colorful image in a children's coloring book style based on this sketch:", potentially adding template info). Consider using `images.createVariation` or `images.edit` for closer adherence to the doodle structure.
        4.  Implement basic safety prompts/filters.
        5.  Return the generated image URL or data to the frontend.
*   **AI Service:**
    *   **Provider:** OpenAI
    *   **API:** Image Generation (DALL·E 2 or 3 - start with cheaper/faster option like DALL·E 2 for MVP unless DALL·E 3 editing/variation shows significantly better results for this use case). Focus on endpoints that allow image input (variations or edits).

**7. API Requirements (Frontend <-> Backend)**

*   `POST /api/generate`
    *   **Request Body:**
        *   `imageData`: Base64 encoded string of the canvas content (PNG format recommended).
        *   `promptHint` (optional): String describing template used (e.g., "cat", "robot").
    *   **Response (Success - 200 OK):**
        *   `imageUrl`: URL of the generated image (if OpenAI returns a URL) OR `imageData`: Base64 encoded string of the generated image.
    *   **Response (Error - e.g., 400, 500):**
        *   `error`: String describing the error (e.g., "Failed to generate image", "Input doodle is empty").

**8. Out of Scope for MVP v1.0**

*   User accounts / Saving history online.
*   Advanced drawing tools (shapes, fill bucket, text, layers).
*   Advanced sharing options (direct social media integration, shareable links).
*   Printing directly from the browser (Download function covers the core need).
*   Multiple AI styles or models to choose from.
*   Animation generation.
*   Collaboration features.
*   Extensive template library.
*   Mobile native apps.

**9. Open Questions / Design Decisions**

*   **OpenAI Endpoint:** Which specific OpenAI API endpoint (`images.generate` with prompt engineering, `images.createVariation`, or `images.edit` with masks) provides the best "coloring book" enhancement effect based on a doodle? *Decision: Requires experimentation during development, start with `createVariation` or `edit` as they take image input directly.*
*   **Prompt Engineering:** How to best translate the doodle + template info into an effective prompt for OpenAI? *Decision: Backend will formulate a prompt like: "Children's coloring book style, vibrant colors, based on the provided sketch of a [templateHint if provided]. Ensure output is safe and child-friendly. [image data/mask]".*
*   **Template Format:** How are templates stored and loaded? *Decision: Simple SVG or PNG outlines stored in the frontend assets.*
*   **Error Handling:** Specific error messages for different failure modes (API key issue, OpenAI service down, content filter triggered). *Decision: Start with generic "Generation failed" message for MVP, refine if time permits.*
*   **Rate Limiting/Cost Control:** Is any needed for MVP? *Decision: Monitor usage initially. If costs spike, implement a simple client-side cooldown on the Generate button.*

---

This PRD provides a clear scope and requirements for building the MVP of the "Draw With Me" application using React and OpenAI. It focuses on delivering the core user value quickly while outlining the necessary technical components and considerations.