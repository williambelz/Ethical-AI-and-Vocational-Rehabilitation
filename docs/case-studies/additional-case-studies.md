---
title: "Additional Case Studies"
description: "More real-world examples of ethical AI in vocational rehabilitation"
sidebar_position: 2
slug: "/additional-case-studies"
---

# Additional Case Studies

This page expands on the examples listed in the README by providing three more case studies. Each opens with a quick summary of takeaways followed by a short explanation of what happened and why it matters.

## Case Study 1: Accessible Resume Screener

**Key Points**
- Automated resume screener used by a mid-sized recruiting firm
- Initial deployment lacked alt text and keyboard navigation
- After accessibility audit, interface redesigned to meet WCAG 2.2 AA requirements
- Inclusion of diverse applicant data reduced bias in candidate scoring

**Explanation**
The recruiting firm adopted an AI tool to filter job applicants. Early user testing showed screen-reader users could not navigate the forms, violating [ACCESSIBILITY_REQUIREMENTS](../ACCESSIBILITY_REQUIREMENTS.md). Developers added semantic labels and ensured sufficient color contrast. They also re-trained the model with a dataset that included applicants with varied employment histories, resulting in improved fairness and compliance.

## Case Study 2: Predictive Retention Modeling in State VR Program

**Key Points**
- State agency used machine learning to predict which clients might drop out of training
- Counselors received risk scores with explanatory text
- Transparent model allowed clients to challenge inaccurate predictions
- Drop-out rate decreased by 12% over one year

**Explanation**
A state vocational rehabilitation program built a predictive model using anonymized case records. Each prediction came with a plain-language summary so counselors could discuss results with clients. The team monitored outcomes and updated the model quarterly. Providing clear reasoning and an appeals process increased trust among participants and improved retention.

## Case Study 3: Adaptive VR Workplace Simulation

**Key Points**
- University research project used AI to adjust simulation difficulty in real time
- Participants with traumatic brain injuries received personalized prompts
- Feedback from therapists shaped algorithm updates
- Study emphasized accessible design to avoid sensory overload

**Explanation**
Researchers developed a VR workplace simulator that modifies tasks based on user performance. To meet accessibility goals, all text alternatives and captions followed the repository's requirements. Therapists noted that adjustable pacing helped reduce cognitive strain. By combining human oversight with adaptive algorithms, the project demonstrated a successful approach to inclusive VR training.

