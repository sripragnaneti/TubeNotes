import re
from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts the video ID from a YouTube URL.
    Supports short and long formats.
    """
    pattern = r'(?:v=|\/)([0-9A-Za-z_-]{11}).*'
    match = re.search(pattern, url)
    return match.group(1) if match else None

def get_transcript_text(video_id: str) -> str:
    """
    Fetches the transcript text for a given video ID.
    Tries to fetch in English first, or auto-generated.
    """
    try:
        transcript_list = YouTubeTranscriptApi().list(video_id)
        
        try:
            # Try to find manually created transcript in English
            transcript = transcript_list.find_manually_created_transcript(['en'])
        except:
            try:
                # Try to find auto-generated transcript in English
                transcript = transcript_list.find_generated_transcript(['en'])
            except:
                # Fallback to the first available transcript and translate
                transcript = transcript_list.find_transcript(['en'])
        
        data = transcript.fetch()
        full_text = " ".join([item.text for item in data])
        
        # Format with rough timestamps for context, every 100 words or so, or just the raw chunks
        # To feed into the LLM, let's also provide chunks with timestamps if we want detailed chapters.
        # Let's send it with start time in seconds formatted for the LLM.
        
        formatted_transcript = ""
        for entry in data:
            start = int(entry.start)
            minutes = start // 60
            seconds = start % 60
            timestamp = f"[{minutes:02d}:{seconds:02d}]"
            formatted_transcript += f"{timestamp} {entry.text}\n"
            
        return formatted_transcript
        
    except TranscriptsDisabled:
        raise Exception("Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise Exception("No transcript found for this video.")
    except Exception as e:
        raise Exception(f"Failed to retrieve transcript: {str(e)}")
