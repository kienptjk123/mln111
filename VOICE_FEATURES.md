# Tính Năng Voice Narration với Live Caption

Tính năng mới này đã được thêm vào phòng triển lãm 3D, cho phép người dùng nghe mô tả AI voice và xem live caption cho từng bức tranh.

## 🎵 Tính Năng Chính

### 1. Audio Controls trong Painting Modal

- **Play/Pause Button**: Phát và tạm dừng audio
- **Progress Bar**: Hiển thị tiến trình và cho phép tua
- **Time Display**: Hiển thị thời gian hiện tại / tổng thời gian
- **Stop Button**: Dừng hoàn toàn audio
- **Auto-play**: Tự động phát audio khi mở modal

### 2. Live Caption System

- Hiển thị phụ đề đồng bộ với audio
- Animation fade in/out mượt mà
- Vị trí tối ưu không che ảnh chính
- Hỗ trợ nhiều ngôn ngữ

### 3. 3D Audio Indicators

- **Visual Indicators**: Icons audio trên mỗi bức tranh trong không gian 3D
- **Interactive Controls**: Click để phát/tạm dừng audio trực tiếp trong 3D
- **Status Visualization**: Hiệu ứng pulsing khi đang phát
- **Hover Effects**: Tooltip hiển thị thông tin khi hover

## 🔧 Cấu Trúc File

```
public/audio/
├── abstract-art-1.mp3        # Voice cho Abstract Art 1
├── portrait-1.mp3            # Voice cho Portrait 1
├── landscape-1.mp3           # Voice cho Landscape 1
├── modern-art.mp3            # Voice cho Modern Art
├── classical-portrait.mp3    # Voice cho Classical Portrait
├── mountain-landscape.mp3    # Voice cho Mountain Landscape
├── masterpiece.mp3           # Voice cho Masterpiece
├── circular-art-1.mp3        # Voice cho Circular Art 1
└── circular-art-2.mp3        # Voice cho Circular Art 2
```

## 🎯 Components Mới

### 1. `useVoicePlayer` Hook

```typescript
const [voiceState, voiceControls] = useVoicePlayer();

// State: isPlaying, currentTime, duration, progress, isLoading, error
// Controls: play(), pause(), stop(), seek(), setVolume(), loadAudio()
```

### 2. `LiveCaption` Component

```typescript
<LiveCaption
  currentTime={voiceState.currentTime}
  isPlaying={voiceState.isPlaying}
  captions={captions}
/>
```

### 3. `AudioIndicator` Component (3D)

```typescript
<AudioIndicator
  position={[x, y, z]}
  isPlaying={isAudioPlaying}
  paintingTitle="Title"
  onPlayClick={handlePlay}
/>
```

## 🎨 UX Features

### Audio Controls

- ⏯️ **Play/Pause**: Toggle phát/tạm dừng
- ⏹️ **Stop**: Dừng và reset về đầu
- ⏭️ **Skip**: Tua nhanh +10 giây
- 📊 **Progress Bar**: Click để jump tới vị trí bất kỳ
- 🔊 **Volume**: Điều chỉnh âm lượng (coming soon)

### Visual Feedback

- 🟢 **Green**: Đang phát audio
- 🔵 **Blue**: Hover state
- ⚫ **Gray**: Trạng thái nghỉ
- 💨 **Pulsing**: Hiệu ứng sóng âm khi phát
- 💬 **Tooltip**: Thông tin khi hover

## 📱 Responsive Design

### Desktop

- Audio controls trong sidebar của modal
- Live caption ở bottom center
- 3D indicators tối ưu cho mouse interaction

### Mobile (Future Enhancement)

- Audio controls có thể collapse
- Touch-friendly 3D indicators
- Caption positioning tối ưu cho màn hình nhỏ

## 🛠️ Tạo File Audio

### Cách 1: Sử dụng Script Tự Động

```bash
# macOS/Linux
chmod +x create-audio-files.sh
./create-audio-files.sh

# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
./create-audio-files.ps1
```

### Cách 2: Online TTS Services

1. **Google Cloud Text-to-Speech**
2. **Amazon Polly**
3. **Azure Speech Services**
4. **ElevenLabs** (AI Voice)

### Cách 3: Recording Studio

- Thu âm với micro chuyên nghiệp
- Export định dạng MP3, 128kbps+
- Độ dài 30-60 giây mỗi file

## 🎯 Cách Sử Dụng

### Trong 3D Gallery

1. Di chuyển đến gần bức tranh
2. Nhìn thấy icon audio (🎵) trên tranh
3. Click vào icon để phát/tạm dừng
4. Audio sẽ phát với hiệu ứng visual

### Trong Painting Modal

1. Click vào bức tranh để mở modal
2. Audio tự động bắt đầu phát
3. Sử dụng controls để điều khiển
4. Xem live caption ở phía dưới
5. Click progress bar để jump

## 🔮 Future Enhancements

### Voice Features

- [ ] Multiple voice options (male/female)
- [ ] Speed control (0.5x, 1x, 1.5x, 2x)
- [ ] Language selection
- [ ] AI-generated voices with emotions

### Caption Features

- [ ] Multiple subtitle languages
- [ ] Font size adjustment
- [ ] Positioning options
- [ ] Export subtitles (SRT)

### 3D Features

- [ ] Spatial audio (3D sound positioning)
- [ ] Audio visualization effects
- [ ] Voice-triggered interactions
- [ ] Ambient audio for gallery atmosphere

### Accessibility

- [ ] Keyboard navigation for audio
- [ ] Screen reader compatibility
- [ ] High contrast mode for captions
- [ ] Audio descriptions for visually impaired

## 🐛 Troubleshooting

### Audio Không Phát

1. Kiểm tra file audio có tồn tại trong `/public/audio/`
2. Đảm bảo tên file đúng với `audioKey`
3. Kiểm tra định dạng file (MP3/WAV supported)
4. Allow audio autoplay trong browser

### Caption Không Hiển Thị

1. Kiểm tra `paintingCaptions` object có data
2. Verify currentTime đang update
3. Check caption timing (startTime/endTime)

### Performance Issues

1. Optimize audio file size (compress to 128kbps)
2. Use audio preloading for better UX
3. Implement audio caching
4. Consider lazy loading for large galleries

## 📈 Analytics (Future)

Track user engagement:

- Audio play rates per painting
- Average listening duration
- Skip patterns
- Popular paintings by audio plays

---

**Created by**: AI Assistant  
**Version**: 1.0  
**Last Updated**: September 2025
