/**
 * Multimodal Voice Processing
 * Handles voice input for discount queries and product searches
 */

export interface VoiceAnalysisResult {
  transcript: string;
  confidence: number;
  language: string;
  intent: string;
  entities: VoiceEntity[];
  sentiment: 'positive' | 'neutral' | 'negative';
  query: {
    type: 'discount' | 'product' | 'comparison' | 'general';
    keywords: string[];
    filters?: {
      minDiscount?: number;
      maxPrice?: number;
      category?: string;
      platform?: string;
    };
  };
}

export interface VoiceEntity {
  type: 'product' | 'price' | 'percentage' | 'platform' | 'category';
  value: string;
  confidence: number;
}

export interface VoiceRecordingOptions {
  maxDuration?: number; // seconds
  language?: string;
  autoStop?: boolean;
  noiseReduction?: boolean;
}

/**
 * Process voice input using Coze AI Speech-to-Text
 */
export async function processVoiceInput(
  audioData: Blob | File | ArrayBuffer,
  options?: {
    language?: string;
    detectIntent?: boolean;
    extractEntities?: boolean;
  }
): Promise<VoiceAnalysisResult> {
  const {
    language = 'en-US',
    detectIntent = true,
    extractEntities = true,
  } = options || {};

  try {
    // Convert audio to base64
    const base64Audio = await convertAudioToBase64(audioData);

    // Call Coze AI Speech API
    const response = await fetch(`${process.env.COZE_API_ENDPOINT}/speech/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'X-API-Version': 'v3',
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        audio: base64Audio,
        language,
        tasks: {
          transcription: true,
          intent_detection: detectIntent,
          entity_extraction: extractEntities,
          sentiment_analysis: true,
        },
        model: 'whisper-v3', // Advanced speech recognition
      }),
    });

    if (!response.ok) {
      throw new Error(`Speech API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Process and structure the results
    return processVoiceResults(data);
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw error;
  }
}

/**
 * Process voice recognition results
 */
function processVoiceResults(data: any): VoiceAnalysisResult {
  const transcript = data.transcript || '';
  const lowerTranscript = transcript.toLowerCase();

  // Detect query type
  let queryType: VoiceAnalysisResult['query']['type'] = 'general';
  if (
    lowerTranscript.includes('discount') ||
    lowerTranscript.includes('deal') ||
    lowerTranscript.includes('sale')
  ) {
    queryType = 'discount';
  } else if (
    lowerTranscript.includes('compare') ||
    lowerTranscript.includes('versus') ||
    lowerTranscript.includes('vs')
  ) {
    queryType = 'comparison';
  } else if (
    lowerTranscript.includes('find') ||
    lowerTranscript.includes('show') ||
    lowerTranscript.includes('search')
  ) {
    queryType = 'product';
  }

  // Extract entities
  const entities: VoiceEntity[] = [];
  if (data.entities) {
    entities.push(
      ...data.entities.map((entity: any) => ({
        type: entity.type,
        value: entity.value,
        confidence: entity.confidence,
      }))
    );
  }

  // Extract filters from transcript
  const filters: VoiceAnalysisResult['query']['filters'] = {};

  // Extract percentage
  const percentMatch = lowerTranscript.match(/(\d+)\s*(?:percent|%)/);
  if (percentMatch) {
    filters.minDiscount = parseInt(percentMatch[1]);
  }

  // Extract price
  const priceMatch = lowerTranscript.match(/(?:under|below|less than)\s*\$?(\d+)/);
  if (priceMatch) {
    filters.maxPrice = parseInt(priceMatch[1]);
  }

  // Extract platform
  const platforms = ['amazon', 'walmart', 'target', 'ebay', 'aliexpress', 'shopify'];
  const detectedPlatform = platforms.find(p => lowerTranscript.includes(p));
  if (detectedPlatform) {
    filters.platform = detectedPlatform;
  }

  // Extract keywords
  const keywords = transcript
    .split(/\s+/)
    .filter((word: string) => word.length > 3)
    .filter((word: string) => !['show', 'find', 'with', 'that', 'have', 'from'].includes(word.toLowerCase()));

  return {
    transcript,
    confidence: data.confidence || 0,
    language: data.language || 'en-US',
    intent: data.intent || 'unknown',
    entities,
    sentiment: data.sentiment || 'neutral',
    query: {
      type: queryType,
      keywords,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
  };
}

/**
 * Convert audio to base64
 */
async function convertAudioToBase64(audioData: Blob | File | ArrayBuffer): Promise<string> {
  if (audioData instanceof ArrayBuffer) {
    const blob = new Blob([audioData], { type: 'audio/webm' });
    return blobToBase64(blob);
  }

  // audioData is Blob or File at this point
  return blobToBase64(audioData as Blob);
}

/**
 * Convert Blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Record voice input from microphone
 */
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(options?: VoiceRecordingOptions): Promise<void> {
    const {
      maxDuration = 60,
      autoStop = true,
      noiseReduction = true,
    } = options || {};

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseReduction,
          autoGainControl: true,
        },
      });

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm',
      });

      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();

      // Auto-stop after max duration
      if (autoStop) {
        setTimeout(() => {
          this.stopRecording();
        }, maxDuration * 1000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

/**
 * Text-to-Speech for AI responses
 */
export async function textToSpeech(
  text: string,
  options?: {
    language?: string;
    voice?: 'male' | 'female' | 'neutral';
    speed?: number;
  }
): Promise<Blob> {
  const {
    language = 'en-US',
    voice = 'neutral',
    speed = 1.0,
  } = options || {};

  try {
    const response = await fetch(`${process.env.COZE_API_ENDPOINT}/speech/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'X-API-Version': 'v3',
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        text,
        language,
        voice,
        speed,
        model: 'tts-v3',
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Play audio blob
 */
export function playAudio(audioBlob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.onended = () => {
      URL.revokeObjectURL(audio.src);
      resolve();
    };
    audio.onerror = reject;
    audio.play();
  });
}

/**
 * Voice-enabled discount search
 */
export async function voiceDiscountSearch(
  audioData: Blob | File | ArrayBuffer
): Promise<{
  query: string;
  filters: any;
  confidence: number;
}> {
  const analysis = await processVoiceInput(audioData, {
    detectIntent: true,
    extractEntities: true,
  });

  return {
    query: analysis.transcript,
    filters: analysis.query.filters || {},
    confidence: analysis.confidence,
  };
}

/**
 * Continuous voice recognition for hands-free shopping
 */
export class ContinuousVoiceRecognition {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback?: (result: VoiceAnalysisResult) => void;

  constructor() {
    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = async (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        if (this.onResultCallback) {
          // Process with Coze AI for better understanding
          const audioBlob = new Blob([transcript], { type: 'text/plain' });
          try {
            const result = await processVoiceInput(audioBlob);
            this.onResultCallback(result);
          } catch (error) {
            console.error('Error processing voice result:', error);
          }
        }
      };
    }
  }

  start(onResult: (result: VoiceAnalysisResult) => void): void {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    this.onResultCallback = onResult;
    this.recognition.start();
    this.isListening = true;
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }
}

export default {
  processVoiceInput,
  VoiceRecorder,
  textToSpeech,
  playAudio,
  voiceDiscountSearch,
  ContinuousVoiceRecognition,
};

// Made with Bob
