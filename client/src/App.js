import React, { useState, useEffect, useRef, useCallback } from 'react';

// ===== 工具函數 =====
const generateParticipantId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  return `P${timestamp}-${randomPart}`;
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// 輔助函數：生成音檔路徑
const getStimulusFilePath = (stimulus, baseUrl = '') => {
  return `${baseUrl}/music/${stimulus.genre}/${stimulus.filename}`;
};

// ===== 常數定義 =====
const allGenres = ["classical", "math_rock", "pop_dance", "jazz", "scandipop", "jazz_pop"];
const totalStimuliExpected = 12; // 6 genres * 2 segments/genre

// 統一的曲風選項
const genreOptions = [
  { value: "classical", label: "古典音樂 (Classical)" },
  { value: "math_rock", label: "數字搖滾 (Math Rock)" },
  { value: "pop_dance", label: "流行舞曲 (Pop Dance)" },
  { value: "jazz", label: "爵士樂 (Jazz)" },
  { value: "scandipop", label: "斯堪地流行 (Scandipop)" },
  { value: "jazz_pop", label: "爵士流行 (Jazz Pop)" },
  { value: "other", label: "其他" },
  { value: "not_sure", label: "無法辨識" }
];

// ===== 音樂檔案資料 =====
const musicFiles = [
  { genre: "classical", filename: "classical_song1_segment_start.wav", song_id: "classical_s1", segment_type: "start" },
  { genre: "classical", filename: "classical_song1_segment_mid.wav", song_id: "classical_s1", segment_type: "mid" },
  { genre: "classical", filename: "classical_song2_segment_start.wav", song_id: "classical_s2", segment_type: "start" },
  { genre: "classical", filename: "classical_song2_segment_mid.wav", song_id: "classical_s2", segment_type: "mid" },
  { genre: "classical", filename: "classical_song3_segment_start.wav", song_id: "classical_s3", segment_type: "start" },
  { genre: "classical", filename: "classical_song3_segment_mid.wav", song_id: "classical_s3", segment_type: "mid" },
  { genre: "classical", filename: "classical_song4_segment_start.wav", song_id: "classical_s4", segment_type: "start" },
  { genre: "classical", filename: "classical_song4_segment_mid.wav", song_id: "classical_s4", segment_type: "mid" },

  { genre: "math_rock", filename: "math_rock_song1_segment_start.wav", song_id: "math_rock_s1", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song1_segment_mid.wav", song_id: "math_rock_s1", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song2_segment_start.wav", song_id: "math_rock_s2", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song2_segment_mid.wav", song_id: "math_rock_s2", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song3_segment_start.wav", song_id: "math_rock_s3", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song3_segment_mid.wav", song_id: "math_rock_s3", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song4_segment_start.wav", song_id: "math_rock_s4", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song4_segment_mid.wav", song_id: "math_rock_s4", segment_type: "mid" },

  { genre: "pop_dance", filename: "pop_dance_song1_segment_start.wav", song_id: "pop_dance_s1", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song1_segment_mid.wav", song_id: "pop_dance_s1", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song2_segment_start.wav", song_id: "pop_dance_s2", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song2_segment_mid.wav", song_id: "pop_dance_s2", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song3_segment_start.wav", song_id: "pop_dance_s3", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song3_segment_mid.wav", song_id: "pop_dance_s3", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song4_segment_start.wav", song_id: "pop_dance_s4", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song4_segment_mid.wav", song_id: "pop_dance_s4", segment_type: "mid" },

  { genre: "jazz", filename: "jazz_song1_segment_start.wav", song_id: "jazz_s1", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song1_segment_mid.wav", song_id: "jazz_s1", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song2_segment_start.wav", song_id: "jazz_s2", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song2_segment_mid.wav", song_id: "jazz_s2", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song3_segment_start.wav", song_id: "jazz_s3", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song3_segment_mid.wav", song_id: "jazz_s3", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song4_segment_start.wav", song_id: "jazz_s4", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song4_segment_mid.wav", song_id: "jazz_s4", segment_type: "mid" },

  { genre: "scandipop", filename: "scandipop_song1_segment_start.wav", song_id: "scandipop_s1", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song1_segment_mid.wav", song_id: "scandipop_s1", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song2_segment_start.wav", song_id: "scandipop_s2", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song2_segment_mid.wav", song_id: "scandipop_s2", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song3_segment_start.wav", song_id: "scandipop_s3", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song3_segment_mid.wav", song_id: "scandipop_s3", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song4_segment_start.wav", song_id: "scandipop_s4", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song4_segment_mid.wav", song_id: "scandipop_s4", segment_type: "mid" },

  { genre: "jazz_pop", filename: "jazz_pop_song1_segment_start.wav", song_id: "jazz_pop_s1", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song1_segment_mid.wav", song_id: "jazz_pop_s1", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song2_segment_start.wav", song_id: "jazz_pop_s2", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song2_segment_mid.wav", song_id: "jazz_pop_s2", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song3_segment_start.wav", song_id: "jazz_pop_s3", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song3_segment_mid.wav", song_id: "jazz_pop_s3", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song4_segment_start.wav", song_id: "jazz_pop_s4", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song4_segment_mid.wav", song_id: "jazz_pop_s4", segment_type: "mid" }
];

// ===== 改進的音樂選擇邏輯 =====
const selectMusic = () => {
  const selected = [];
  
  allGenres.forEach(genre => {
    // 獲取該曲風的所有歌曲
    const genreSongs = [...new Set(
      musicFiles
        .filter(m => m.genre === genre)
        .map(m => m.song_id)
    )];
    
    // 如果有足夠的歌曲，選擇兩首不同的
    if (genreSongs.length >= 2) {
      const shuffled = shuffleArray(genreSongs);
      const song1 = shuffled[0];
      const song2 = shuffled[1];
      
      // 為第一首歌選擇 start，第二首歌選擇 mid
      const startSegment = musicFiles.find(
        m => m.genre === genre && 
             m.song_id === song1 && 
             m.segment_type === "start"
      );
      const midSegment = musicFiles.find(
        m => m.genre === genre && 
             m.song_id === song2 && 
             m.segment_type === "mid"
      );
      
      if (startSegment) selected.push(startSegment);
      if (midSegment) selected.push(midSegment);
    } else if (genreSongs.length === 1) {
      // 如果只有一首歌，就選擇它的兩個片段
      const song = genreSongs[0];
      const segments = musicFiles.filter(
        m => m.genre === genre && m.song_id === song
      );
      selected.push(...segments);
    }
  });
  
  return shuffleArray(selected);
};

// Google Form configuration
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSctUuvb1W0yWW8pUoFJ917v-eTWk_RCyWYx7w1TPhXUgq9JMA/formResponse';
const GOOGLE_FORM_FIELD_IDS = {
  participantId: 'entry.2079124097',
  age: 'entry.1384813390',
  gender: 'entry.1976005518',
  musicalBackground: 'entry.1456370923',
  theory: 'entry.1499473583',
  listenFrequency: 'entry.1347606183',
  liveFrequency: 'entry.150689753',
  listeningEnvironment: 'entry.1276443968',
  experimentDuration: 'entry.1956115892',
  totalPlays: 'entry.2136283044',
  avgPlaysPerStimulus: 'entry.1299717200',
  stimulus1: 'entry.1284424283',
  stimulus2: 'entry.702331979',
  stimulus3: 'entry.547457976',
  stimulus4: 'entry.1788793290',
  stimulus5: 'entry.1194166235',
  stimulus6: 'entry.1777131518',
  stimulus7: 'entry.319567093',
  stimulus8: 'entry.858181290',
  stimulus9: 'entry.452409364',
  stimulus10: 'entry.1461352272',
  stimulus11: 'entry.1523437309',
  stimulus12: 'entry.387011442',
};

// ===== 主要組件 =====
const MusicExperimentApp = () => {
  // State management
  const [currentScreen, setCurrentScreen] = useState('intro'); // intro, loading, experiment, completion
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [experimentResults, setExperimentResults] = useState({
    participantId: '',
    demographicInfo: {},
    stimuli: [],
    experimentSummary: {}
  });

  // Demographic form states
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    musicalBackground: '',
    theory: '',
    listenFrequency: '',
    liveFrequency: '',
    listeningEnvironment: '',
    participantId: ''
  });

  // Experiment states
  const [selectedStimuli, setSelectedStimuli] = useState([]);
  const [hasPlayedStimulus, setHasPlayedStimulus] = useState(false);
  const [playCountsPerStimulus, setPlayCountsPerStimulus] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  // Response states (for the current stimulus)
  const [responses, setResponses] = useState({
    likeRating: 4,
    complexRating: 4,
    familiarRating: 4,
    structureRating: '',
    emotionRating: '',
    engagementRating: 4,
    selectedComponent: '',
    genreSelection: ''
  });

  // Refs
  const audioRef = useRef(null);
  const experimentStartTimeRef = useRef(null);
  const currentStimulusStartTimeRef = useRef(null);
  const playIntervalRef = useRef(null);
  const preloadedAudioRef = useRef({});

  // Audio event handlers
  const handleAudioEnded = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
    setHasPlayedStimulus(true);
    setPlayProgress(100);
  }, []);

  const handleAudioError = useCallback((e) => {
    console.error('Audio file load/decode error:', e);
    setIsPlaying(false);
    setIsLoading(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setPlayProgress(0);
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    return () => {
      // Clean up preloaded audio
      Object.values(preloadedAudioRef.current).forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
          audio.pause();
          audio.src = '';
        }
      });
      preloadedAudioRef.current = {};

      // Clean up main audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current = null;
      }

      // Clean up timer
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [handleAudioEnded, handleAudioError]);

  // Preload audio files
  const preloadAudio = async (stimuli) => {
    setPreloadProgress(0);
    const total = stimuli.length;
    let loaded = 0;

    const loadPromises = stimuli.map((stimulus) => {
      return new Promise((resolve) => {
        const filePath = getStimulusFilePath(stimulus, process.env.PUBLIC_URL);
        const audio = new Audio(filePath);
        audio.preload = "auto";
        
        const handleCanPlayThrough = () => {
          loaded++;
          setPreloadProgress((loaded / total) * 100);
          preloadedAudioRef.current[filePath] = audio;
          audio.removeEventListener('canplaythrough', handleCanPlayThrough);
          resolve();
        };

        const handleError = () => {
          console.warn(`Failed to preload: ${filePath}`);
          loaded++;
          setPreloadProgress((loaded / total) * 100);
          resolve();
        };

        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        audio.addEventListener('error', handleError);
        audio.load();
      });
    });

    await Promise.all(loadPromises);
  };

  // Event handlers
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResponseChange = (field, value) => {
    setResponses({
      ...responses,
      [field]: value
    });
  };

  const startExperiment = async () => {
    // Validate form
    const requiredFields = ['age', 'gender', 'musicalBackground', 'theory', 'listenFrequency', 'liveFrequency', 'listeningEnvironment'];
    const isValid = requiredFields.every(field => formData[field]);

    if (!isValid) {
      alert('請填寫所有必填資訊再開始實驗。');
      return;
    }

    // Set loading screen
    setCurrentScreen('loading');

    // Initialize experiment
    experimentStartTimeRef.current = new Date();
    const participantId = formData.participantId || generateParticipantId();

    // Select music
    const selected = selectMusic();
    if (selected.length !== totalStimuliExpected) {
      console.error(`Expected ${totalStimuliExpected} stimuli, but got ${selected.length}. Check music selection logic.`);
      alert(`載入音樂檔案數量不符預期，請重新整理頁面，若仍有問題，請聯繫研究者。`);
      setCurrentScreen('intro');
      return;
    }
    setSelectedStimuli(selected);

    // Initialize play counts
    setPlayCountsPerStimulus(new Array(totalStimuliExpected).fill(0));

    // Set initial experiment results structure
    setExperimentResults({
      participantId,
      demographicInfo: {
        ...formData,
        experimentStartTime: experimentStartTimeRef.current.toISOString()
      },
      stimuli: []
    });

    // Preload audio files
    await preloadAudio(selected);

    // Start experiment
    setCurrentScreen('experiment');
    currentStimulusStartTimeRef.current = new Date();
  };

  const playCurrentStimulus = () => {
    if (!selectedStimuli[currentStimulusIndex] || !audioRef.current) return;

    const stimulus = selectedStimuli[currentStimulusIndex];
    const filePath = getStimulusFilePath(stimulus, process.env.PUBLIC_URL);

    // Update play count
    const newPlayCounts = [...playCountsPerStimulus];
    newPlayCounts[currentStimulusIndex]++;
    setPlayCountsPerStimulus(newPlayCounts);

    setIsLoading(true);
    setIsPlaying(true);
    setPlayProgress(0);

    // Use preloaded audio if available
    const preloadedAudio = preloadedAudioRef.current[filePath];
    if (preloadedAudio && preloadedAudio.readyState >= 3) {
      audioRef.current.src = preloadedAudio.src;
      setIsLoading(false);
    } else {
      audioRef.current.src = filePath;
      audioRef.current.load();
    }

    audioRef.current.play().then(() => {
      setIsLoading(false);
    }).catch(err => {
      console.error('Play Error:', err);
      alert('播放音樂失敗。請確保瀏覽器允許自動播放，或嘗試重新點擊播放按鈕。');
      setIsPlaying(false);
      setIsLoading(false);
      setPlayProgress(0);
    });

    // Progress tracking
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    
    playIntervalRef.current = setInterval(() => {
      const currentAudio = audioRef.current;
      if (currentAudio && currentAudio.duration) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        setPlayProgress(progress);

        if (currentAudio.ended || progress >= 100) {
          if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
          }
          setIsPlaying(false);
          setHasPlayedStimulus(true);
          setPlayProgress(100);
        }
      }
    }, 100);
  };

  const nextStimulus = () => {
    // Validate play requirement
    if (playCountsPerStimulus[currentStimulusIndex] === 0 && !hasPlayedStimulus) {
      alert('請先聆聽音樂片段再回答問題。');
      return;
    }

    // Validate responses
    if (!responses.structureRating || !responses.emotionRating ||
      !responses.selectedComponent || !responses.genreSelection) {
      alert('請填寫所有問題再繼續。');
      return;
    }

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Clear play interval
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }

    // Record results for current stimulus
    const questionEndTime = new Date();
    const currentStimulusData = selectedStimuli[currentStimulusIndex];
    const questionDurationMs = questionEndTime - currentStimulusStartTimeRef.current;

    const stimulusResponse = {
      stimulusIndex: currentStimulusIndex + 1,
      genre: currentStimulusData.genre,
      song_id: currentStimulusData.song_id,
      segment_type: currentStimulusData.segment_type,
      likeRating: parseInt(responses.likeRating),
      complexRating: parseInt(responses.complexRating),
      familiarRating: parseInt(responses.familiarRating),
      structureRating: responses.structureRating,
      emotionRating: responses.emotionRating,
      engagementRating: parseInt(responses.engagementRating),
      selectedComponent: responses.selectedComponent,
      genreSelection: responses.genreSelection,
      totalPlayCount: playCountsPerStimulus[currentStimulusIndex],
      questionStartTime: currentStimulusStartTimeRef.current.toISOString(),
      questionEndTime: questionEndTime.toISOString(),
      questionDurationMs: questionDurationMs
    };

    // Update experiment results
    setExperimentResults(prevResults => {
      const updatedResults = {
        ...prevResults,
        stimuli: [...prevResults.stimuli, stimulusResponse]
      };
      
      // Check if this is the last stimulus
      if (currentStimulusIndex + 1 >= totalStimuliExpected) {
        completeExperimentWithResults(updatedResults);
      }
      
      return updatedResults;
    });

    // Move to next stimulus or complete
    if (currentStimulusIndex + 1 < totalStimuliExpected) {
      setCurrentStimulusIndex(currentStimulusIndex + 1);
      setHasPlayedStimulus(false);
      setPlayProgress(0);
      currentStimulusStartTimeRef.current = new Date();

      // Reset responses
      setResponses({
        likeRating: 4,
        complexRating: 4,
        familiarRating: 4,
        structureRating: '',
        emotionRating: '',
        engagementRating: 4,
        selectedComponent: '',
        genreSelection: ''
      });
    }
  };

  // Submit to Google Form
  const submitToGoogleForm = (results) => {
    const params = new URLSearchParams();

    // Participant & demographics
    params.append(GOOGLE_FORM_FIELD_IDS.participantId, results.participantId);
    params.append(GOOGLE_FORM_FIELD_IDS.age, results.demographicInfo.age);
    params.append(GOOGLE_FORM_FIELD_IDS.gender, results.demographicInfo.gender);
    params.append(GOOGLE_FORM_FIELD_IDS.musicalBackground, results.demographicInfo.musicalBackground);
    params.append(GOOGLE_FORM_FIELD_IDS.theory, results.demographicInfo.theory);
    params.append(GOOGLE_FORM_FIELD_IDS.listenFrequency, results.demographicInfo.listenFrequency);
    params.append(GOOGLE_FORM_FIELD_IDS.liveFrequency, results.demographicInfo.liveFrequency);
    params.append(GOOGLE_FORM_FIELD_IDS.listeningEnvironment, results.demographicInfo.listeningEnvironment);

    // Summary fields
    if (results.experimentSummary) {
      params.append(GOOGLE_FORM_FIELD_IDS.experimentDuration, 
        results.experimentSummary.totalExperimentDurationMin || '0');
      params.append(GOOGLE_FORM_FIELD_IDS.totalPlays, 
        String(results.experimentSummary.playStatistics?.totalPlays || 0));
      params.append(GOOGLE_FORM_FIELD_IDS.avgPlaysPerStimulus, 
        String(results.experimentSummary.playStatistics?.averagePlaysPerStimulus || 0));
      params.append('pageHistory', '0');
    }

    // Each stimulus response
    results.stimuli.forEach((stim, idx) => {
      const fieldId = GOOGLE_FORM_FIELD_IDS[`stimulus${idx + 1}`];
      if (fieldId) {
        const stimulusData = `Genre: ${stim.genre}, Segment: ${stim.segment_type}, Like: ${stim.likeRating}, Complex: ${stim.complexRating}, Familiar: ${stim.familiarRating}, Structure: ${stim.structureRating}, Emotion: ${stim.emotionRating}, Engagement: ${stim.engagementRating}, Component: ${stim.selectedComponent}, GenreGuess: ${stim.genreSelection}, Plays: ${stim.totalPlayCount}`;
        params.append(fieldId, stimulusData);
      }
    });

    // Submit with no-cors mode
    fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }).then(() => {
      console.log('Google Form submission completed');
    }).catch(err => {
      console.warn('Google Form submission error:', err);
    });
  };

  // Submit to local server
  const submitDataToLocalServer = async (data) => {
    const serverBaseUrl = 'http://localhost:3001';
    const endpoint = `${serverBaseUrl}/api/submit-results`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Results successfully submitted to local server.');
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit to local server: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error connecting to local server:', error);
    }
  };

  // Submit to Formspree
  const submitDataToFormspree = async (data) => {
    const formDataForSubmission = {
      participantId: data.participantId,
      demographicInfo: JSON.stringify(data.demographicInfo),
      experimentSummary: JSON.stringify(data.experimentSummary),
      totalStimuli: data.stimuli.length
    };

    // Add each stimulus response
    data.stimuli.forEach((stimulus, index) => {
      formDataForSubmission[`stimulus_${index + 1}`] = JSON.stringify(stimulus);
    });

    try {
      const response = await fetch('https://formspree.io/f/xyzwvbgg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataForSubmission)
      });

      if (response.ok) {
        console.log('Data submitted successfully to Formspree');
      } else {
        console.error('Formspree submission failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting to Formspree:', error);
    }
  };

  // Complete experiment with results
  const completeExperimentWithResults = (results) => {
    const experimentEndTime = new Date();
    const totalDurationMs = experimentEndTime - experimentStartTimeRef.current;

    // Calculate statistics
    const totalPlays = results.stimuli.reduce((sum, s) => sum + s.totalPlayCount, 0);
    const averagePlaysPerStimulus = totalPlays / results.stimuli.length;

    const allQuestionDurations = results.stimuli.map(s => s.questionDurationMs);
    const totalQuestionDurationMs = allQuestionDurations.reduce((sum, duration) => sum + duration, 0);
    const averageQuestionTimeMs = totalQuestionDurationMs / results.stimuli.length;

    const maxPlaysForAnyStimulus = Math.max(...results.stimuli.map(s => s.totalPlayCount));
    const minPlaysForAnyStimulus = Math.min(...results.stimuli.map(s => s.totalPlayCount));

    const finalResults = {
      ...results,
      experimentSummary: {
        experimentStartTime: experimentStartTimeRef.current.toISOString(),
        experimentEndTime: experimentEndTime.toISOString(),
        totalExperimentDurationMs: totalDurationMs,
        totalExperimentDurationMin: (totalDurationMs / 60000).toFixed(2),
        totalStimuliCompleted: results.stimuli.length,
        playStatistics: {
          totalPlays,
          averagePlaysPerStimulus: averagePlaysPerStimulus.toFixed(2),
          maxPlaysForAnyStimulus,
          minPlaysForAnyStimulus
        },
        averageQuestionTimeMs: averageQuestionTimeMs.toFixed(0),
        averageQuestionTimeSec: (averageQuestionTimeMs / 1000).toFixed(2)
      }
    };

    // Update state and submit
    setExperimentResults(finalResults);
    setCurrentScreen('completion');

    // Submit to all endpoints
    submitToGoogleForm(finalResults);
    submitDataToFormspree(finalResults);
    submitDataToLocalServer(finalResults);
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(experimentResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `music_experiment_${experimentResults.participantId}_${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render functions
  const renderIntroScreen = () => (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Term Project for NTHU 2025 Spring MIR (by Su Li) //v21</h1>
      <hr className="my-6" />
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">歡迎參與本次音樂感知實驗！</h2>
        <p className="mb-4">在這個實驗中，您將聆聽 12 段音樂片段，並分享您對這些音樂感受進行評分反饋。</p>
        <p className="mb-4">實驗總長度約 10 分鐘。為確保數據品質，請您盡可能在安靜的環境下專心聆聽並作答。</p>
        <p className="mb-6">您的回應將完全匿名，僅供研究目的使用。感謝您的時間！</p>

        <div className="space-y-4">
          <div className="form-group">
            <label className="block mb-2 font-medium">年齡:</label>
            <select
              name="age"
              value={formData.age}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">年齡區間</option>
              <option value="15-17">15-17</option>
              <option value="18-21">18-21</option>
              <option value="22-24">22-24</option>
              <option value="25-29">25-29</option>
              <option value="30-35">30-35</option>
              <option value="36-40">36-40</option>
              <option value="41-50">41-50</option>
              <option value="51-60">51-60</option>
              <option value="61-65">61-65</option>
              <option value="65+">65+</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">性別:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="others">其他</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">音樂背景:</label>
            <select
              name="musicalBackground"
              value={formData.musicalBackground}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇您的程度</option>
              <option value="none">無音樂訓練</option>
              <option value="beginner">初學者 (少於兩年)</option>
              <option value="intermediate">中等 (2-5 年)</option>
              <option value="advanced">進階 (5+ 年)</option>
              <option value="professional">職業音樂人</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">請問您會樂理嗎?</label>
            <select
              name="theory"
              value={formData.theory}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇</option>
              <option value="none">完全不會</option>
              <option value="basic">基本</option>
              <option value="intermediate">中等</option>
              <option value="advanced">進階</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">請問您聽音樂的頻率:</label>
            <select
              name="listenFrequency"
              value={formData.listenFrequency}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇頻率</option>
              <option value="mostthetime">隨時</option>
              <option value="everyday">每天</option>
              <option value="everyweek">每週</option>
              <option value="sometimes">偶爾</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">請問您參加現場演出的頻率:</label>
            <select
              name="liveFrequency"
              value={formData.liveFrequency}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇</option>
              <option value="never">從不</option>
              <option value="weekly">平均每週一次</option>
              <option value="monthly">平均每月一次</option>
              <option value="halfyear">平均每半年一次</option>
              <option value="yearly">平均每年一次</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">當前聆聽設置:</label>
            <select
              name="listeningEnvironment"
              value={formData.listeningEnvironment}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">請選擇</option>
              <option value="laptop-headphones-indoor">電腦/筆電/平板：室內-耳機</option>
              <option value="laptop-headphones-outdoor">電腦/筆電/平板：室外-耳機</option>
              <option value="laptop-speakers">電腦/筆電/平板：直接播放</option>
              <option value="mobile-headphones-indoor">手機：室內-耳機</option>
              <option value="mobile-headphones-outdoor">手機：室外-耳機</option>
              <option value="mobile-speakers">手機：直接播放</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">參與者ID (選填):</label>
            <input
              type="text"
              name="participantId"
              value={formData.participantId}
              onChange={handleFormChange}
              placeholder="可留空，系統會自動生成"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={startExperiment}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 ease-in-out"
          >
            開始實驗
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-700 mb-2">正在載入音樂檔案，請稍候...</p>
        {preloadProgress > 0 && (
          <div className="w-64 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${preloadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(preloadProgress)}%</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExperimentScreen = () => {
    const radius = 50;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (playProgress / 100) * circumference;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <p className="text-lg mb-2">實驗進度: {currentStimulusIndex + 1}/{totalStimuliExpected}</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${((currentStimulusIndex + 1) / totalStimuliExpected) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-center">
            請您點擊「播放音樂」按鈕，仔細聆聽這段音樂。請自行調整音量大小。
          </h2>

          <div className="mb-8 flex flex-col items-center">
            <button
              onClick={playCurrentStimulus}
              disabled={isPlaying || isLoading}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 ease-in-out transform hover:scale-105 ${
                isPlaying || isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
              }`}
            >
              {isLoading ? '載入中...' : isPlaying ? '播放中...' : '播放音樂'}
            </button>

            {playCountsPerStimulus[currentStimulusIndex] > 0 && (
              <span className="mt-4 text-gray-600 text-sm">
                播放次數: {playCountsPerStimulus[currentStimulusIndex]}
              </span>
            )}
            <p className="mt-4 text-center text-gray-600 text-sm leading-relaxed">
              完整聽完後，若想再聆聽，可再次點擊「播放音樂」按鈕。
            </p>

            {/* Circular progress bar */}
            <div className="mt-8 relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
                <circle
                  className="text-blue-500 transition-all duration-100 ease-linear"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-800">
                {isPlaying ? `${playProgress.toFixed(0)}%` : '0%'}
              </div>
            </div>

            {/* Questions */}
            <div className={`space-y-8 mt-8 w-full ${hasPlayedStimulus ? 'block' : 'hidden'}`}>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">請問您有多喜歡這段音樂？</h3>
                <p className="mb-4 text-gray-700">請拖動滑桿來評估您對這段音樂的喜好程度。</p>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={responses.likeRating}
                  onChange={(e) => handleResponseChange('likeRating', e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-lg"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1（非常不喜歡）</span>
                  <span>4（普通）</span>
                  <span>7（非常喜歡）</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">對您而言，這段音樂的感知複雜度如何？</h3>
                <p className="mb-4 text-gray-700">請評估這段音樂對您來說，聽起來是不是有點難理解。</p>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={responses.complexRating}
                  onChange={(e) => handleResponseChange('complexRating', e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-md"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1（非常簡單）</span>
                  <span>4（普通）</span>
                  <span>7（非常複雜）</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">請問您對這類音樂有多熟悉？</h3>
                <p className="mb-4 text-gray-700">請評估您過去接觸或聆聽這類音樂的頻率和程度。</p>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={responses.familiarRating}
                  onChange={(e) => handleResponseChange('familiarRating', e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-md"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 (非常不熟悉/從未聽過)</span>
                  <span>4 (好像有聽過/不太確定)</span>
                  <span>7 (非常熟悉/經常聆聽)</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">你對這段音樂的「結構」理解或欣賞程度為何？</h3>
                <p className="mb-4 text-gray-700">請評估您是否能理解或欣賞這段音樂的組織方式、發展脈絡，以及各個段落的安排等。</p>
                <div className="space-y-2">
                  {[
                    { value: '1', label: '1 非常容易理解/欣賞 (結構非常清晰)' },
                    { value: '2', label: '2 容易理解/欣賞' },
                    { value: '3', label: '3 普通 (不特別理解，也不覺得困難)' },
                    { value: '4', label: '4 較難理解/欣賞' },
                    { value: '5', label: '5 非常難理解/欣賞 (結構非常混亂或不明)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="structure"
                        value={option.value}
                        checked={responses.structureRating === option.value}
                        onChange={(e) => handleResponseChange('structureRating', e.target.value)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">請問這段音樂對您的情緒的影響有多強烈？</h3>
                <p className="mb-4 text-gray-700">請評估這段音樂在多大程度上觸動或改變了您的情緒狀態。</p>
                <div className="space-y-2">
                  {[
                    { value: '1', label: '1 完全無感 (沒有引起任何情緒波動)' },
                    { value: '2', label: '2 輕微影響' },
                    { value: '3', label: '3 中等影響 (略有感受，但不強烈)' },
                    { value: '4', label: '4 較強影響' },
                    { value: '5', label: '5 非常強烈 (引起非常明顯的情緒反應)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="emotion"
                        value={option.value}
                        checked={responses.emotionRating === option.value}
                        onChange={(e) => handleResponseChange('emotionRating', e.target.value)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">請問您有多投入這段音樂？</h3>
                <p className="mb-4 text-gray-700">請評估您在聆聽這段音樂時，注意力集中的程度，以及是否完全沉浸其中。</p>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={responses.engagementRating}
                  onChange={(e) => handleResponseChange('engagementRating', e.target.value)}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-md"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 (非常抽離/容易分心)</span>
                  <span>4 (普通)</span>
                  <span>7 (非常投入/完全沉浸)</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">在聆聽這段音樂時，您最主要注意到哪個音樂成分？</h3>
                <p className="mb-4 text-gray-700">請選擇最吸引您注意力的音樂元素。</p>
                <div className="space-y-2">
                  {[
                    { value: 'melody', label: '旋律 (Melody)' },
                    { value: 'rhythm', label: '節奏 (Rhythm)' },
                    { value: 'harmony', label: '和聲 (Harmony)' },
                    { value: 'timbre', label: '音色 (Timbre)' },
                    { value: 'none', label: '毫無概念' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="component"
                        value={option.value}
                        checked={responses.selectedComponent === option.value}
                        onChange={(e) => handleResponseChange('selectedComponent', e.target.value)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

               <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-4">您認為這首音樂屬於哪種曲風？</h3>
                <p className="mb-4 text-gray-700">請選擇您認為最符合這段音樂的曲風分類。若不確定，可選擇「無法辨識」。</p>
                <select
                  value={responses.genreSelection}
                  onChange={(e) => handleResponseChange('genreSelection', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">請選擇曲風</option>
                  <option value="classical">古典音樂 (Classical)</option>
                  <option value="folk">民謠 (Folk)</option>
                  <option value="citypop">城市流行 (City Pop)</option>
                  <option value="pop_dance">流行舞曲 (Pop Dance)</option>
                  <option value="jazz_pop">爵士流行 (Jazz Pop)</option>
                  <option value="techno">科技舞曲 (Techno)</option>
                  <option value="math_rock">數字搖滾 (Math Rock)</option>
                  <option value="jazz">爵士樂 (Jazz)</option>
                  <option value="tropical_house">熱帶浩室 (Tropical House)</option>
                  <option value="other">其他</option>
                  <option value="not_sure">無法辨識</option>
                </select>
              </div>

              <button
                onClick={nextStimulus}
                disabled={
                  (playCountsPerStimulus[currentStimulusIndex] === 0 && !hasPlayedStimulus) ||
                  !responses.structureRating ||
                  !responses.emotionRating ||
                  !responses.selectedComponent ||
                  !responses.genreSelection
                }
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors duration-200 ease-in-out ${
                  ((playCountsPerStimulus[currentStimulusIndex] > 0 || hasPlayedStimulus) &&
                   responses.structureRating &&
                   responses.emotionRating &&
                   responses.selectedComponent &&
                   responses.genreSelection)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                {currentStimulusIndex + 1 < totalStimuliExpected ? '下一題' : '完成實驗'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletionScreen = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">感謝您的參與！</h2>
        <p className="text-lg mb-6">您的回應已被記錄。</p>

        {experimentResults.experimentSummary && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">實驗摘要</h3>
            <p className="mb-2 text-gray-700">
              總實驗時間: <span className="font-medium">{experimentResults.experimentSummary.totalExperimentDurationMin} 分鐘</span>
            </p>
            <p className="mb-2 text-gray-700">
              完成刺激數量: <span className="font-medium">{experimentResults.experimentSummary.totalStimuliCompleted} / {totalStimuliExpected}</span>
            </p>
            <p className="mb-2 text-gray-700">
              總播放次數: <span className="font-medium">{experimentResults.experimentSummary.playStatistics.totalPlays}</span>
            </p>
            <p className="mb-2 text-gray-700">
              平均每個音樂片段播放次數: <span className="font-medium">{experimentResults.experimentSummary.playStatistics.averagePlaysPerStimulus} 次</span>
            </p>
            <p className="mb-2 text-gray-700">
              每個音樂片段最大播放次數: <span className="font-medium">{experimentResults.experimentSummary.playStatistics.maxPlaysForAnyStimulus} 次</span>
            </p>
            <p className="mb-2 text-gray-700">
              每個音樂片段最小播放次數: <span className="font-medium">{experimentResults.experimentSummary.playStatistics.minPlaysForAnyStimulus} 次</span>
            </p>
            <p className="mb-2 text-gray-700">
              平均答題時間: <span className="font-medium">{experimentResults.experimentSummary.averageQuestionTimeSec} 秒</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={downloadResults}
            className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 ease-in-out shadow-md"
          >
            下載實驗數據 (JSON備份)
          </button>

          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200 ease-in-out ml-4 shadow-md"
          >
            重新開始
          </button>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow">
        {currentScreen === 'intro' && renderIntroScreen()}
        {currentScreen === 'loading' && renderLoadingScreen()}
        {currentScreen === 'experiment' && renderExperimentScreen()}
        {currentScreen === 'completion' && renderCompletionScreen()}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-600">
          有任何建議與問題歡迎聯繫: yangchenlin@gapp.nthu.edu.tw
        </p>
      </footer>
    </div>
  );
};

export default MusicExperimentApp;