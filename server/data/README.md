# Brandastic Chatbot Knowledge Base

This directory contains all the knowledge base files that power the Brandastic chatbot's responses.

## File Structure

### Core Files
- `knowledgeBase.js` - Main knowledge base that imports and combines all data
- `salesProcess.js` - Detailed sales process and pricing structure
- `detailedServices.js` - Comprehensive service descriptions and industry expertise

## How to Update the Knowledge Base

### Adding New Services
1. Edit `detailedServices.js`
2. Add new service under the appropriate category
3. Include description, features, process, and benefits
4. Update the main `knowledgeBase.js` if needed

### Updating Pricing
1. Edit `salesProcess.js` in the `pricingStructure` object
2. Update price ranges, timelines, and included features
3. The chatbot will automatically use the new pricing in responses

### Adding New FAQs
1. Edit `knowledgeBase.js` in the `faqs` object
2. Add new question-answer pairs
3. Use lowercase keys for questions
4. Include specific pricing and details in answers

### Updating Sales Process
1. Edit `salesProcess.js`
2. Modify phases, timelines, deliverables, or activities
3. The chatbot will reference this in process-related questions

### Adding Industry Information
1. Edit `detailedServices.js` in the `industryExpertise` object
2. Add new industries with specialties and results
3. Include specific metrics and success stories

## Best Practices

### Writing Responses
- Keep answers conversational but professional
- Include specific pricing ranges when possible
- Always suggest booking a consultation for detailed discussions
- Use "we" when referring to Brandastic
- Mention Justin and the team when appropriate

### Pricing Guidelines
- Provide ranges rather than exact prices
- Include timelines and what's included
- Mention that final pricing depends on specific needs
- Always suggest a consultation for custom quotes

### Call-to-Action
- End responses with questions to keep conversation flowing
- Suggest booking calls for complex inquiries
- Use phrases like "Would you like to schedule a call with Justin and our team?"

## Testing Changes

After making updates:
1. Restart the server to load new data
2. Test common questions in the chatbot
3. Verify pricing information is accurate
4. Check that new FAQs are working
5. Ensure the sales process information is current

## Data Sources

Keep this information updated based on:
- Current Brandastic pricing sheets
- Sales team feedback
- Common customer questions
- Marketing materials and website content
- Industry-specific case studies and results