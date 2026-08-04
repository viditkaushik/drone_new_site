Objective: Update the existing ORCA single-page site in C:\Users\kvidi\Documents\drone_site\v1 to reflect a revised systems story.

Audience: defense/autonomy technical partners evaluating onboard drone autonomy.

Existing project:
- Standalone static site using index.html, styles.css, script.js.
- Existing visual style is dark editorial, high-contrast, condensed uppercase type, orange technical accents, full-screen scrolling chapters.
- Do not create a new standalone mockup. Modify the existing app files.

Required content changes:
- Merge "Perception Models" and "Infrared Detection" into one system under the "PERCEPTION MODELS" chapter.
- Use the attached infrared detection image at C:\Users\kvidi\AppData\Local\Temp\codex-clipboard-5dd86d4b-78ae-494d-9df5-3969f9493912.png in that merged Perception Models chapter.
- Remove the separate "INFRARED DETECTION" chapter.
- Keep four systems total. After "ADAPTIVE AUTONOMY", add a new fourth chapter titled "PLUG AND PLAY".
- Use the second video at C:\Users\kvidi\Downloads\collapsing_video.mp4 for the new Plug and Play chapter.
- Copy the supplied image/video into the site's assets folder and reference those project-local asset paths.
- Update the systems heading if needed so "FOUR SYSTEMS. ONE LOCAL TRUTH." still makes sense.
- Remove architecture panel chip lists such as "CAMERA FRAMES", "IMU STREAM", "OPTIONAL LWIR", and the equivalent list chips for all four architecture options. The architecture panel should show the stage title and description only.
- Update script.js stage data so it no longer defines/uses list chips.

Motion/interaction changes:
- Add proper scroll transitions between chapters/sections. Keep them tasteful and compatible with the current dark editorial style.
- Existing reveal animations can remain, but chapters should feel smoother during scroll: add section/chapter enter states, media parallax or scale/fade, and staggered content movement where appropriate.
- Respect prefers-reduced-motion.
- Do not add visible instructional text describing the animations.

Design constraints:
- Preserve the existing ORCA aesthetic and responsive behavior.
- Avoid nested cards, decorative blobs/orbs, or marketing-style generic layouts.
- Ensure text does not overlap media at desktop or mobile sizes.
- Keep the page runnable as static HTML.

Output:
- Edit C:\Users\kvidi\Documents\drone_site\v1\index.html
- Edit C:\Users\kvidi\Documents\drone_site\v1\styles.css
- Edit C:\Users\kvidi\Documents\drone_site\v1\script.js
- Add copied assets under C:\Users\kvidi\Documents\drone_site\v1\assets
- Report changed files and a short summary.
