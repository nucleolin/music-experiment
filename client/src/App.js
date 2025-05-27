import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ===== Constants =====
const TOTAL_STIMULI_EXPECTED = 12;
const LOCAL_SERVER_URL = 'http://localhost:3001/api/submit-results';
const FORMSPREE_URL = 'https://formspree.io/f/xyzwvbgg';

const SCREENS = {
  INTRO: 'intro',
  LOADING: 'loading',
  EXPERIMENT: 'experiment',
  COMPLETION: 'completion'
};

const GENRE_OPTIONS = [
  { value: "classical", label: "古典音樂 (Classical)" },
  { value: "math_rock", label: "數字搖滾 (Math Rock)" },
  { value: "pop_dance", label: "流行舞曲 (Pop Dance)" },
  { value: "jazz", label: "爵士樂 (Jazz)" },
  { value: "scandipop", label: "斯堪地流行 (Scandipop)" },
  { value: "jazz_pop", label: "爵士流行 (Jazz Pop)" },
  { value: "other", label: "其他" },
  { value: "not_sure", label: "無法辨識" }
];

const EXTENDED_GENRE_OPTIONS = [
  { value: "classical", label: "古典音樂 (Classical)" },
  { value: "folk", label: "民謠 (Folk)" },
  { value: "citypop", label: "城市流行 (City Pop)" },
  { value: "pop_dance", label: "流行舞曲 (Pop Dance)" },
  { value: "jazz_pop", label: "爵士流行 (Jazz Pop)" },
  { value: "techno", label: "科技舞曲 (Techno)" },
  { value: "math_rock", label: "數字搖滾 (Math Rock)" },
  { value: "jazz", label: "爵士樂 (Jazz)" },
  { value: "tropical_house", label: "熱帶浩室 (Tropical House)" },
  { value: "other", label: "其他" },
  { value: "not_sure", label: "無法辨識" }
];

const INITIAL_FORM_DATA = {
  age: '',
  gender: '',
  musicalBackground: '',
  theory: '',
  listenFrequency: '',
  liveFrequency: '',
  listeningEnvironment: '',
  participantId: ''
};

const INITIAL_RESPONSES = {
  likeRating: 4,
  complexRating: 4,
  familiarRating: 4,
  structureRating: '',
  emotionRating: '',
  engagementRating: 4,
  selectedComponent: '',
  genreSelection: '',
  curiosityRating: 4
};

// ===== Music Files Data =====
const musicFiles = [
  // Classical
  { genre: "classical", filename: "classical_song1_segment_start.wav", song_id: "classical_s1", segment_type: "start" },
  { genre: "classical", filename: "classical_song1_segment_mid.wav", song_id: "classical_s1", segment_type: "mid" },
  { genre: "classical", filename: "classical_song2_segment_start.wav", song_id: "classical_s2", segment_type: "start" },
  { genre: "classical", filename: "classical_song2_segment_mid.wav", song_id: "classical_s2", segment_type: "mid" },
  { genre: "classical", filename: "classical_song3_segment_start.wav", song_id: "classical_s3", segment_type: "start" },
  { genre: "classical", filename: "classical_song3_segment_mid.wav", song_id: "classical_s3", segment_type: "mid" },
  { genre: "classical", filename: "classical_song4_segment_start.wav", song_id: "classical_s4", segment_type: "start" },
  { genre: "classical", filename: "classical_song4_segment_mid.wav", song_id: "classical_s4", segment_type: "mid" },
  
  // Math Rock
  { genre: "math_rock", filename: "math_rock_song1_segment_start.wav", song_id: "math_rock_s1", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song1_segment_mid.wav", song_id: "math_rock_s1", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song2_segment_start.wav", song_id: "math_rock_s2", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song2_segment_mid.wav", song_id: "math_rock_s2", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song3_segment_start.wav", song_id: "math_rock_s3", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song3_segment_mid.wav", song_id: "math_rock_s3", segment_type: "mid" },
  { genre: "math_rock", filename: "math_rock_song4_segment_start.wav", song_id: "math_rock_s4", segment_type: "start" },
  { genre: "math_rock", filename: "math_rock_song4_segment_mid.wav", song_id: "math_rock_s4", segment_type: "mid" },
  
  // Pop Dance
  { genre: "pop_dance", filename: "pop_dance_song1_segment_start.wav", song_id: "pop_dance_s1", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song1_segment_mid.wav", song_id: "pop_dance_s1", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song2_segment_start.wav", song_id: "pop_dance_s2", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song2_segment_mid.wav", song_id: "pop_dance_s2", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song3_segment_start.wav", song_id: "pop_dance_s3", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song3_segment_mid.wav", song_id: "pop_dance_s3", segment_type: "mid" },
  { genre: "pop_dance", filename: "pop_dance_song4_segment_start.wav", song_id: "pop_dance_s4", segment_type: "start" },
  { genre: "pop_dance", filename: "pop_dance_song4_segment_mid.wav", song_id: "pop_dance_s4", segment_type: "mid" },
  
  // Jazz
  { genre: "jazz", filename: "jazz_song1_segment_start.wav", song_id: "jazz_s1", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song1_segment_mid.wav", song_id: "jazz_s1", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song2_segment_start.wav", song_id: "jazz_s2", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song2_segment_mid.wav", song_id: "jazz_s2", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song3_segment_start.wav", song_id: "jazz_s3", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song3_segment_mid.wav", song_id: "jazz_s3", segment_type: "mid" },
  { genre: "jazz", filename: "jazz_song4_segment_start.wav", song_id: "jazz_s4", segment_type: "start" },
  { genre: "jazz", filename: "jazz_song4_segment_mid.wav", song_id: "jazz_s4", segment_type: "mid" },
  
  // Scandipop
  { genre: "scandipop", filename: "scandipop_song1_segment_start.wav", song_id: "scandipop_s1", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song1_segment_mid.wav", song_id: "scandipop_s1", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song2_segment_start.wav", song_id: "scandipop_s2", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song2_segment_mid.wav", song_id: "scandipop_s2", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song3_segment_start.wav", song_id: "scandipop_s3", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song3_segment_mid.wav", song_id: "scandipop_s3", segment_type: "mid" },
  { genre: "scandipop", filename: "scandipop_song4_segment_start.wav", song_id: "scandipop_s4", segment_type: "start" },
  { genre: "scandipop", filename: "scandipop_song4_segment_mid.wav", song_id: "scandipop_s4", segment_type: "mid" },
  
  // Jazz Pop
  { genre: "jazz_pop", filename: "jazz_pop_song1_segment_start.wav", song_id: "jazz_pop_s1", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song1_segment_mid.wav", song_id: "jazz_pop_s1", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song2_segment_start.wav", song_id: "jazz_pop_s2", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song2_segment_mid.wav", song_id: "jazz_pop_s2", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song3_segment_start.wav", song_id: "jazz_pop_s3", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song3_segment_mid.wav", song_id: "jazz_pop_s3", segment_type: "mid" },
  { genre: "jazz_pop", filename: "jazz_pop_song4_segment_start.wav", song_id: "jazz_pop_s4", segment_type: "start" },
  { genre: "jazz_pop", filename: "jazz_pop_song4_segment_mid.wav", song_id: "jazz_pop_s4", segment_type: "mid" }
];

// ===== Utility Functions =====
const generateParticipantId = () => {
  const timestamp = Date.now();
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

const getStimulusFilePath = (stimulus, baseUrl = '') => {
  return `${baseUrl}/music/${stimulus.genre}/${stimulus.filename}`;
};

// ===== Music Selection Configuration =====
const MUSIC_SELECTION_CONFIG = {
  // 總共需要的片段數
  totalStimuli: 12,
  
  // 每個曲風的配置
  genreDistribution: {
    "classical": 2,
    "math_rock": 3,
    "jazz": 3,
    "pop_dance": 1,
    "scandipop": 1,
    "jazz_pop": 2
  },
  
  // 選擇策略配置
  selectionStrategy: {
    // 當需要奇數個片段時如何分配
    oddCountStrategy: 'mixed', // 'mixed': 混合不同歌曲, 'same': 盡量同一首歌
    
    // 是否確保每首歌的 start 和 mid 都被選中
    ensureBothSegments: false,
    
    // 是否優先選擇不同的歌曲
    preferDifferentSongs: true,
    
    // 每個曲風最多使用幾首不同的歌曲
    maxSongsPerGenre: 3
  }
};

const selectMusicFlexible = (config = MUSIC_SELECTION_CONFIG) => {
  const selected = [];
  const { genreDistribution, selectionStrategy } = config;
  
  Object.entries(genreDistribution).forEach(([genre, targetCount]) => {
    if (targetCount === 0) return;
    
    // 獲取該曲風的所有歌曲
    const genreSongs = [...new Set(
      musicFiles
        .filter(m => m.genre === genre)
        .map(m => m.song_id)
    )];
    
    if (genreSongs.length === 0) {
      console.warn(`No songs found for genre: ${genre}`);
      return;
    }
    
    // 打亂歌曲順序
    const shuffledSongs = shuffleArray(genreSongs);
    
    // 獲取該曲風的所有片段
    const genreSegments = musicFiles.filter(m => m.genre === genre);
    
    // 根據策略選擇片段
    const selectedSegments = selectSegmentsByStrategy(
      genreSegments,
      shuffledSongs,
      targetCount,
      selectionStrategy
    );
    
    selected.push(...selectedSegments);
  });
  
  console.log(`Selected ${selected.length} segments:`, 
    selected.map(s => `${s.genre}-${s.song_id}-${s.segment_type}`));
  
  // 驗證是否達到目標數量
  if (selected.length !== config.totalStimuli) {
    console.warn(`Expected ${config.totalStimuli} stimuli, but got ${selected.length}`);
  }
  
  return shuffleArray(selected);
};

// 根據策略選擇片段的輔助函數
const selectSegmentsByStrategy = (genreSegments, shuffledSongs, targetCount, strategy) => {
  const selected = [];
  const { preferDifferentSongs, ensureBothSegments, maxSongsPerGenre } = strategy;
  
  // 限制使用的歌曲數量
  const songsToUse = shuffledSongs.slice(0, Math.min(maxSongsPerGenre, shuffledSongs.length));
  
  if (preferDifferentSongs && songsToUse.length >= targetCount) {
    // 策略1: 優先從不同歌曲選擇
    for (let i = 0; i < targetCount && i < songsToUse.length; i++) {
      const song = songsToUse[i];
      const songSegments = genreSegments.filter(s => s.song_id === song);
      
      if (songSegments.length > 0) {
        // 隨機選擇 start 或 mid
        const randomSegment = songSegments[Math.floor(Math.random() * songSegments.length)];
        selected.push(randomSegment);
      }
    }
  } else if (ensureBothSegments) {
    // 策略2: 確保選擇完整的歌曲（start + mid）
    let segmentsNeeded = targetCount;
    let songIndex = 0;
    
    while (segmentsNeeded > 0 && songIndex < songsToUse.length) {
      const song = songsToUse[songIndex];
      const startSegment = genreSegments.find(s => s.song_id === song && s.segment_type === 'start');
      const midSegment = genreSegments.find(s => s.song_id === song && s.segment_type === 'mid');
      
      if (segmentsNeeded >= 2 && startSegment && midSegment) {
        selected.push(startSegment, midSegment);
        segmentsNeeded -= 2;
      } else if (segmentsNeeded === 1) {
        const segment = startSegment || midSegment;
        if (segment) {
          selected.push(segment);
          segmentsNeeded -= 1;
        }
      }
      
      songIndex++;
    }
  } else {
    // 策略3: 平衡選擇（默認）
    const segmentsPerSong = Math.ceil(targetCount / songsToUse.length);
    let remainingCount = targetCount;
    
    for (const song of songsToUse) {
      if (remainingCount <= 0) break;
      
      const songSegments = genreSegments.filter(s => s.song_id === song);
      const segmentsToTake = Math.min(segmentsPerSong, remainingCount, songSegments.length);
      
      // 打亂並選擇片段
      const shuffledSegments = shuffleArray(songSegments);
      selected.push(...shuffledSegments.slice(0, segmentsToTake));
      remainingCount -= segmentsToTake;
    }
  }
  
  // 如果還沒有達到目標數量，從所有可用片段中補充
  if (selected.length < targetCount) {
    const remainingSegments = genreSegments.filter(s => !selected.includes(s));
    const shuffledRemaining = shuffleArray(remainingSegments);
    const needed = targetCount - selected.length;
    selected.push(...shuffledRemaining.slice(0, needed));
  }
  
  return selected.slice(0, targetCount);
};

// 保留原始函數以保持兼容性
const selectMusic = () => selectMusicFlexible(MUSIC_SELECTION_CONFIG);

// ===== Custom Hooks =====
const useAudio = (onEnded) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const playIntervalRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  
  // Update onEnded ref when it changes
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);
  
  const handleAudioEnded = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
    setPlayProgress(100);
    // Trigger callback when audio ends
    if (onEndedRef.current) {
      onEndedRef.current();
    }
  }, []);
  
  const handleAudioError = useCallback((e) => {
    console.error('Audio file load/decode error:', e);
    console.error('Audio src:', audioRef.current?.src);
    console.error('Error type:', e.type);
    console.error('Audio readyState:', audioRef.current?.readyState);
    console.error('Audio error code:', audioRef.current?.error?.code);
    console.error('Audio error message:', audioRef.current?.error?.message);
    
    setIsPlaying(false);
    setIsLoading(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setPlayProgress(0);
    
    // 顯示更友好的錯誤訊息
    const errorMessages = {
      1: '音頻文件加載被中止',
      2: '網絡錯誤：無法加載音頻文件',
      3: '音頻解碼錯誤：文件格式可能不支持',
      4: '音頻源不支持'
    };
    
    const errorCode = audioRef.current?.error?.code || 0;
    const message = errorMessages[errorCode] || '未知的音頻加載錯誤';
    
    alert(`${message}\n\n文件路徑: ${audioRef.current?.src}\n\n請確保音頻文件存在且格式正確。`);
  }, []);
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current = null;
      }
      
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [handleAudioEnded, handleAudioError]);
  
  const playAudio = useCallback((src) => {
    if (!audioRef.current) {
      console.error('Audio ref is null');
      return;
    }
    
    // 確保 src 有效
    if (!src || src === '' || src === process.env.PUBLIC_URL || src.endsWith('/')) {
      console.error('Invalid audio source:', src);
      alert('無效的音頻路徑');
      return;
    }
    
    console.log('Playing audio:', src);
    
    setIsLoading(true);
    setIsPlaying(true);
    setPlayProgress(0);
    
    // 清理之前的音頻
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    
    // 設置新的音頻源
    audioRef.current.src = src;
    
    // 添加加載事件監聽
    const handleCanPlay = () => {
      console.log('Audio can play:', src);
      audioRef.current.removeEventListener('canplay', handleCanPlay);
    };
    
    const handleLoadStart = () => {
      console.log('Audio load started:', src);
      audioRef.current.removeEventListener('loadstart', handleLoadStart);
    };
    
    const handleLoadedData = () => {
      console.log('Audio loaded data:', src);
      audioRef.current.removeEventListener('loadeddata', handleLoadedData);
    };
    
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('loadstart', handleLoadStart);
    audioRef.current.addEventListener('loadeddata', handleLoadedData);
    
    // 載入音頻
    audioRef.current.load();
    
    // 等待可以播放時才播放
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Audio playing successfully');
        setIsLoading(false);
        
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
              setPlayProgress(100);
            }
          }
        }, 100);
      }).catch(err => {
        console.error('Play Error:', err);
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          audioSrc: audioRef.current?.src
        });
        
        alert(`播放音樂失敗。\n\n錯誤: ${err.message}\n\n請確保：\n1. 瀏覽器允許自動播放\n2. 音頻文件存在於正確路徑\n3. 音頻格式被瀏覽器支持`);
        setIsPlaying(false);
        setIsLoading(false);
        setPlayProgress(0);
      });
    }
  }, []);
  
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // 不要清空 src，保持最後的狀態以便除錯
    }
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
    setPlayProgress(0);
  }, []);
  
  return {
    playAudio,
    stopAudio,
    isPlaying,
    isLoading,
    playProgress
  };
};

// ===== Components =====
const ProgressBar = ({ value, max, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
    <div
      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const CircularProgress = ({ progress }) => {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
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
        {`${progress.toFixed(0)}%`}
      </div>
    </div>
  );
};

const RangeInput = ({ label, description, value, onChange, min = 1, max = 7, labels }) => (
  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
    <h3 className="text-lg font-semibold mb-4">{label}</h3>
    {description && <p className="mb-4 text-gray-700">{description}</p>}
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-md"
    />
    {labels && (
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    )}
  </div>
);

const RadioGroup = ({ label, description, options, value, onChange, name }) => (
  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
    <h3 className="text-lg font-semibold mb-4">{label}</h3>
    {description && <p className="mb-4 text-gray-700">{description}</p>}
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
            required
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const SelectInput = ({ label, description, options, value, onChange, placeholder = "請選擇" }) => (
  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
    <h3 className="text-lg font-semibold mb-4">{label}</h3>
    {description && <p className="mb-4 text-gray-700">{description}</p>}
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      required
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// ===== Main Component =====
const MusicExperimentApp = () => {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [experimentResults, setExperimentResults] = useState({
    participantId: '',
    demographicInfo: {},
    stimuli: [],
    experimentSummary: {}
  });
  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedStimuli, setSelectedStimuli] = useState([]);
  const [hasPlayedStimulus, setHasPlayedStimulus] = useState(false);
  const [playCountsPerStimulus, setPlayCountsPerStimulus] = useState([]);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [responses, setResponses] = useState(INITIAL_RESPONSES);
  
  const experimentStartTimeRef = useRef(null);
  const currentStimulusStartTimeRef = useRef(null);
  const preloadedAudioRef = useRef({});
  
  // Audio ended callback
  const handleAudioCompleted = useCallback(() => {
    setHasPlayedStimulus(true);
  }, []);
  
  const { playAudio, stopAudio, isPlaying, isLoading, playProgress } = useAudio(handleAudioCompleted);
  
  // Memoized values
  const isFormValid = useMemo(() => {
    const requiredFields = ['age', 'gender', 'musicalBackground', 'theory', 
                          'listenFrequency', 'liveFrequency', 'listeningEnvironment'];
    return requiredFields.every(field => formData[field]);
  }, [formData]);
  
  const isResponsesValid = useMemo(() => {
    return responses.structureRating && 
           responses.emotionRating && 
           responses.selectedComponent && 
           responses.genreSelection && 
           responses.curiosityRating;
  }, [responses]);
  
  const canProceed = useMemo(() => {
    return (playCountsPerStimulus[currentStimulusIndex] > 0 || hasPlayedStimulus) && 
           isResponsesValid;
  }, [playCountsPerStimulus, currentStimulusIndex, hasPlayedStimulus, isResponsesValid]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(preloadedAudioRef.current).forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
          audio.pause();
          audio.src = '';
        }
      });
      preloadedAudioRef.current = {};
    };
  }, []);
  
  // Audio preloading
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
  const handleFormChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  
  const handleResponseChange = useCallback((field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  const startExperiment = async () => {
    if (!isFormValid) {
      alert('請填寫所有必填資訊再開始實驗。');
      return;
    }
    
    setCurrentScreen(SCREENS.LOADING);
    
    experimentStartTimeRef.current = new Date();
    const participantId = formData.participantId || generateParticipantId();
    
    const selected = selectMusic();
    if (selected.length !== MUSIC_SELECTION_CONFIG.totalStimuli) {
      console.error(`Expected ${MUSIC_SELECTION_CONFIG.totalStimuli} stimuli, but got ${selected.length}`);
      alert(`載入音樂檔案數量不符預期，請重新整理頁面。`);
      setCurrentScreen(SCREENS.INTRO);
      return;
    }
    
    setSelectedStimuli(selected);
    setPlayCountsPerStimulus(new Array(TOTAL_STIMULI_EXPECTED).fill(0));
    
    setExperimentResults({
      participantId,
      demographicInfo: {
        ...formData,
        experimentStartTime: experimentStartTimeRef.current.toISOString()
      },
      stimuli: []
    });
    
    await preloadAudio(selected);
    
    setCurrentScreen(SCREENS.EXPERIMENT);
    currentStimulusStartTimeRef.current = new Date();
  };
  
  const playCurrentStimulus = () => {
    if (!selectedStimuli[currentStimulusIndex]) {
      console.error('No stimulus at index:', currentStimulusIndex);
      return;
    }
    
    const stimulus = selectedStimuli[currentStimulusIndex];
    
    // 檢查 stimulus 資訊是否完整
    if (!stimulus || !stimulus.filename || !stimulus.genre) {
      console.error('Stimulus information incomplete:', stimulus);
      alert('音樂檔案資訊不完整');
      return;
    }
    
    const filePath = getStimulusFilePath(stimulus, process.env.PUBLIC_URL);
    
    // 確認路徑生成正確
    console.log('Loading file:', filePath);
    console.log('Stimulus details:', {
      index: currentStimulusIndex,
      genre: stimulus.genre,
      filename: stimulus.filename,
      song_id: stimulus.song_id,
      segment_type: stimulus.segment_type
    });
    
    // 更新播放計數
    setPlayCountsPerStimulus(prev => {
      const newCounts = [...prev];
      newCounts[currentStimulusIndex]++;
      return newCounts;
    });
    
    // 檢查是否有預載入的音頻
    const preloadedAudio = preloadedAudioRef.current[filePath];
    if (preloadedAudio && preloadedAudio.readyState >= 3) {
      console.log('Using preloaded audio for:', filePath);
      // 使用預載入的音頻源
      playAudio(preloadedAudio.src);
    } else {
      console.log('No preloaded audio, loading:', filePath);
      // 直接播放
      playAudio(filePath);
    }
  };
  
  const submitData = async (data) => {
    // Submit to local server
    try {
      const response = await fetch(LOCAL_SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    
    // Submit to Formspree
    const formDataForSubmission = {
      participantId: data.participantId,
      demographicInfo: JSON.stringify(data.demographicInfo),
      experimentSummary: JSON.stringify(data.experimentSummary),
      totalStimuli: data.stimuli.length
    };
    
    data.stimuli.forEach((stimulus, index) => {
      formDataForSubmission[`stimulus_${index + 1}`] = JSON.stringify(stimulus);
    });
    
    try {
      const response = await fetch(FORMSPREE_URL, {
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
  
  const completeExperimentWithResults = useCallback((results) => {
    const experimentEndTime = new Date();
    const totalDurationMs = experimentEndTime - experimentStartTimeRef.current;
    
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
    
    setExperimentResults(finalResults);
    setCurrentScreen(SCREENS.COMPLETION);
    
    submitData(finalResults);
  }, []);
  
  const nextStimulus = () => {
    if (!canProceed) {
      if (playCountsPerStimulus[currentStimulusIndex] === 0 && !hasPlayedStimulus) {
        alert('請先聆聽音樂片段再回答問題。');
      } else {
        alert('請填寫所有問題再繼續。');
      }
      return;
    }
    
    stopAudio();
    
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
      curiosityRating: parseInt(responses.curiosityRating),
      totalPlayCount: playCountsPerStimulus[currentStimulusIndex],
      questionStartTime: currentStimulusStartTimeRef.current.toISOString(),
      questionEndTime: questionEndTime.toISOString(),
      questionDurationMs: questionDurationMs
    };
    
    const isLastStimulus = currentStimulusIndex + 1 >= TOTAL_STIMULI_EXPECTED;
    
    if (isLastStimulus) {
      // For the last stimulus, update results and complete experiment
      const updatedResults = {
        ...experimentResults,
        stimuli: [...experimentResults.stimuli, stimulusResponse]
      };
      setExperimentResults(updatedResults);
      completeExperimentWithResults(updatedResults);
    } else {
      // For non-last stimulus, just update results and move to next
      setExperimentResults(prevResults => ({
        ...prevResults,
        stimuli: [...prevResults.stimuli, stimulusResponse]
      }));
      
      setCurrentStimulusIndex(currentStimulusIndex + 1);
      setHasPlayedStimulus(false);
      currentStimulusStartTimeRef.current = new Date();
      setResponses(INITIAL_RESPONSES);
    }
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
  
  // Render screens
  const renderIntroScreen = () => (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Term Project for NTHU 2025 Spring MIR (by Su Li)</h1>
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
            disabled={!isFormValid}
            className={`w-full py-3 px-6 rounded-md transition-colors duration-200 ease-in-out ${
              isFormValid
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
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
  
  const renderExperimentScreen = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <p className="text-lg mb-2">實驗進度: {currentStimulusIndex + 1}/{TOTAL_STIMULI_EXPECTED}</p>
          <ProgressBar value={currentStimulusIndex + 1} max={TOTAL_STIMULI_EXPECTED} />
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
          
          <div className="mt-8">
            <CircularProgress progress={playProgress} />
          </div>
          
          {hasPlayedStimulus && (
            <div className="space-y-8 mt-8 w-full animate-fadeIn">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800 text-center">
                  音樂播放完畢，請回答以下問題：
                </p>
              </div>
              <RangeInput
                label="請問您有多喜歡這段音樂？"
                description="請拖動滑桿來評估您對這段音樂的喜好程度。"
                value={responses.likeRating}
                onChange={(e) => handleResponseChange('likeRating', e.target.value)}
                labels={['1（非常不喜歡）', '4（普通）', '7（非常喜歡）']}
              />
              
              <RangeInput
                label="對您而言，這段音樂的感知複雜度如何？"
                description="請評估這段音樂對您來說，聽起來是不是有點難理解。"
                value={responses.complexRating}
                onChange={(e) => handleResponseChange('complexRating', e.target.value)}
                labels={['1（非常簡單）', '4（普通）', '7（非常複雜）']}
              />
              
              <RangeInput
                label="請問您對這類音樂有多熟悉？"
                description="請評估您過去接觸或聆聽這類音樂的頻率和程度。"
                value={responses.familiarRating}
                onChange={(e) => handleResponseChange('familiarRating', e.target.value)}
                labels={['1 (非常不熟悉/從未聽過)', '4 (好像有聽過/不太確定)', '7 (非常熟悉/經常聆聽)']}
              />
              
              <RadioGroup
                label="你對這段音樂的「結構」理解或欣賞程度為何？"
                description="請評估您是否能理解或欣賞這段音樂的組織方式、發展脈絡，以及各個段落的安排等。"
                name="structure"
                value={responses.structureRating}
                onChange={(e) => handleResponseChange('structureRating', e.target.value)}
                options={[
                  { value: '1', label: '1 非常容易理解/欣賞 (結構非常清晰)' },
                  { value: '2', label: '2 容易理解/欣賞' },
                  { value: '3', label: '3 普通 (不特別理解，也不覺得困難)' },
                  { value: '4', label: '4 較難理解/欣賞' },
                  { value: '5', label: '5 非常難理解/欣賞 (結構非常混亂或不明)' }
                ]}
              />
              
              <RadioGroup
                label="請問這段音樂對您的情緒的影響有多強烈？"
                description="請評估這段音樂在多大程度上觸動或改變了您的情緒狀態。"
                name="emotion"
                value={responses.emotionRating}
                onChange={(e) => handleResponseChange('emotionRating', e.target.value)}
                options={[
                  { value: '1', label: '1 完全無感 (沒有引起任何情緒波動)' },
                  { value: '2', label: '2 輕微影響' },
                  { value: '3', label: '3 中等影響 (略有感受，但不強烈)' },
                  { value: '4', label: '4 較強影響' },
                  { value: '5', label: '5 非常強烈 (引起非常明顯的情緒反應)' }
                ]}
              />
              
              <RangeInput
                label="請問您有多投入這段音樂？"
                description="請評估您在聆聽這段音樂時，注意力集中的程度，以及是否完全沉浸其中。"
                value={responses.engagementRating}
                onChange={(e) => handleResponseChange('engagementRating', e.target.value)}
                labels={['1 (非常抽離/容易分心)', '4 (普通)', '7 (非常投入/完全沉浸)']}
              />
              
              <RadioGroup
                label="在聆聽這段音樂時，您最主要注意到哪個音樂成分？"
                description="請選擇最吸引您注意力的音樂元素。"
                name="component"
                value={responses.selectedComponent}
                onChange={(e) => handleResponseChange('selectedComponent', e.target.value)}
                options={[
                  { value: 'melody', label: '旋律 (Melody)' },
                  { value: 'rhythm', label: '節奏 (Rhythm)' },
                  { value: 'harmony', label: '和聲 (Harmony)' },
                  { value: 'timbre', label: '音色 (Timbre)' },
                  { value: 'none', label: '毫無概念' }
                ]}
              />
              
              <SelectInput
                label="您認為這首音樂屬於哪種曲風？"
                description="請選擇您認為最符合這段音樂的曲風分類。若不確定，可選擇「無法辨識」。"
                options={EXTENDED_GENRE_OPTIONS}
                value={responses.genreSelection}
                onChange={(e) => handleResponseChange('genreSelection', e.target.value)}
                placeholder="請選擇曲風"
              />
              
              <RangeInput
                label="請問您有多想知道這個音樂片段是哪首歌？"
                description="請根據您剛才聽到的片段，評估您對這首歌的好奇程度。"
                value={responses.curiosityRating}
                onChange={(e) => handleResponseChange('curiosityRating', e.target.value)}
                labels={['1（完全不想知道）', '4（有點想知道）', '7（非常想知道）']}
              />
              
              <button
                onClick={nextStimulus}
                disabled={!canProceed}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors duration-200 ease-in-out ${
                  canProceed
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                {currentStimulusIndex + 1 < TOTAL_STIMULI_EXPECTED ? '下一題' : '完成實驗'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
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
              完成刺激數量: <span className="font-medium">{experimentResults.experimentSummary.totalStimuliCompleted} / {TOTAL_STIMULI_EXPECTED}</span>
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
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
      <main className="flex-grow">
        {currentScreen === SCREENS.INTRO && renderIntroScreen()}
        {currentScreen === SCREENS.LOADING && renderLoadingScreen()}
        {currentScreen === SCREENS.EXPERIMENT && renderExperimentScreen()}
        {currentScreen === SCREENS.COMPLETION && renderCompletionScreen()}
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