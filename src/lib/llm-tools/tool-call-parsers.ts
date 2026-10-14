import {ToolParser, ToolParserResult} from "react-native-executorch/llm";
import JSON5 from "json5";

export const gemma4ToolParser: ToolParser = (text: string): ToolParserResult | undefined => {
    const match = text.match(/<\|tool_call>call:(\w+)([\s\S]*?)<tool_call\|>/);
    if (!match) {
        return undefined;
    }

    try {
        const functionName = match[1];
        const argsRaw = match[2].replaceAll('<|"|>', '"');
        const args = JSON5.parse(argsRaw)

        return {
            toolCalls: [
                {
                    function: {
                        name: functionName,
                        arguments: args,
                    }
                }
            ]
        }

    } catch (error) {
        console.error('Failed to parse Gemma 4 tool call JSON:', error);
        return undefined;
    }
};

export const qwenToolParser: ToolParser = (text: string): ToolParserResult | undefined => {
    const match = text.match(/<tool_call>([\s\S]*?)<\/tool_call>/);
    if (!match) return undefined;
    try {
        let toolCall = JSON.parse(match[1]);

        return {
            toolCalls: [{
                function: {
                    name: toolCall.name,
                    arguments: toolCall.arguments,
                }
            }]
        }
    } catch (error) {
        console.error(error)
        return undefined;
    }
};