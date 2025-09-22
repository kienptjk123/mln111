#!/bin/bash

# Script để tạo file audio demo bằng Text-to-Speech
# Yêu cầu: macOS (say), Linux (espeak), hoặc Windows (PowerShell)

AUDIO_DIR="./public/audio"

# Danh sách các mô tả tranh với nội dung tiếng Việt
declare -A descriptions=(
    ["abstract-art-1"]="Một tác phẩm trừu tượng đầy màu sắc khám phá sự tương tác giữa màu sắc và hình khối, thể hiện sự hỗn loạn và vẻ đẹp của cuộc sống hiện đại."
    ["portrait-1"]="Một chân dung thân mật nắm bắt được bản chất của cảm xúc con người thông qua nét vẽ tinh tế và ánh sáng khéo léo."
    ["landscape-1"]="Một bức tranh phong cảnh thanh bình mô tả vẻ đẹp yên tĩnh của thiên nhiên với những ngọn đồi thoai thoải và ánh nắng vàng."
    ["modern-art"]="Một tác phẩm đương đại thách thức những ranh giới nghệ thuật truyền thống với những hình khối hình học táo bạo và màu sắc tương phản mạnh mẽ."
    ["classical-portrait"]="Một chân dung vượt thời gian theo truyền thống cổ điển thể hiện kỹ thuật tinh tế và chủ đề trang nghiêm."
    ["mountain-landscape"]="Những đỉnh núi hùng vĩ vươn lên trên bầu trời kịch tính nắm bắt sức mạnh nguyên sơ và vẻ đẹp của thiên nhiên hoang dã."
    ["masterpiece"]="Báu vật của bộ sưu tập chúng tôi, một kiệt tác đại diện cho đỉnh cao của thành tựu nghệ thuật và ý nghĩa văn hóa."
)

echo "Tạo file audio demo cho gallery..."

# Tạo thư mục nếu chưa có
mkdir -p "$AUDIO_DIR"

# Kiểm tra hệ điều hành và sử dụng TTS engine phù hợp
if command -v say >/dev/null 2>&1; then
    # macOS
    echo "Sử dụng macOS say command..."
    for key in "${!descriptions[@]}"; do
        echo "Tạo $key.mp3..."
        say "${descriptions[$key]}" -o "$AUDIO_DIR/${key}.aiff"
        # Convert to MP3 if ffmpeg is available
        if command -v ffmpeg >/dev/null 2>&1; then
            ffmpeg -i "$AUDIO_DIR/${key}.aiff" -acodec mp3 "$AUDIO_DIR/${key}.mp3" -y
            rm "$AUDIO_DIR/${key}.aiff"
        else
            mv "$AUDIO_DIR/${key}.aiff" "$AUDIO_DIR/${key}.mp3"
        fi
    done
elif command -v espeak >/dev/null 2>&1; then
    # Linux
    echo "Sử dụng espeak..."
    for key in "${!descriptions[@]}"; do
        echo "Tạo $key.mp3..."
        espeak -v vi -s 120 -a 100 "${descriptions[$key]}" -w "$AUDIO_DIR/${key}.wav"
        # Convert to MP3 if ffmpeg is available
        if command -v ffmpeg >/dev/null 2>&1; then
            ffmpeg -i "$AUDIO_DIR/${key}.wav" -acodec mp3 "$AUDIO_DIR/${key}.mp3" -y
            rm "$AUDIO_DIR/${key}.wav"
        else
            mv "$AUDIO_DIR/${key}.wav" "$AUDIO_DIR/${key}.mp3"
        fi
    done
else
    echo "Không tìm thấy Text-to-Speech engine phù hợp."
    echo "Trên Windows, bạn có thể sử dụng PowerShell:"
    echo ""
    echo "Add-Type -AssemblyName System.Speech"
    echo "\$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer"
    echo "\$synth.Speak('Your text here')"
    echo ""
    echo "Hoặc sử dụng online TTS services như:"
    echo "- Google Cloud Text-to-Speech"
    echo "- Amazon Polly"
    echo "- Azure Speech Services"
fi

echo "Hoàn thành!"