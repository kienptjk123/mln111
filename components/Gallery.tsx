"use client";

import { useRef } from "react";
import type { Mesh } from "three";
import { useTexture, Text } from "@react-three/drei";
import ProximityAudioTrigger from "./ProximityAudioTrigger";
import { useVoicePlayer } from "@/hooks/useVoicePlayer";

// Component khung tranh ornate
function OrnateFrame({
  position,
  rotation = [0, 0, 0],
  title,
  imageUrl,
  size = [2, 1.5],
  isCircular = false,
  paintingData,
  onPaintingClick,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  imageUrl: string;
  size?: [number, number];
  isCircular?: boolean;
  paintingData: any;
  onPaintingClick: (paintingData: any) => void;
}) {
  const texture = useTexture(imageUrl);

  return (
    <group position={position} rotation={rotation}>
      {/* Outer ornate frame */}
      <mesh>
        <boxGeometry args={[size[0] + 0.4, size[1] + 0.4, 0.15]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>

      {/* Inner frame */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Painting */}
      <mesh
        position={[0, 0, 0.16]}
        onClick={() => onPaintingClick(paintingData)}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
        userData={{ paintingData }}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} color="white" />
      </mesh>

      {/* Classical nameplate */}
      <mesh position={[0, -size[1] / 2 - 0.4, 0.1]}>
        <boxGeometry args={[size[0] * 0.8, 0.3, 0.05]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, -size[1] / 2 - 0.4, 0.13]}
        fontSize={0.1}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.7}
        textAlign="center"
        fontWeight="bold"
      >
        {title}
      </Text>
    </group>
  );
}

interface PaintingData {
  title: string;
  imageUrl: string;
  description: string;
  audioKey: string;
}

export const paintingDescriptions: Record<string, PaintingData> = {
  BoiCanh1_Anh1: {
    title: "Thế giới của những điều hiển nhiên",
    imageUrl: "/BoiCanh1_Anh1.png",
    description:
      "Một bức tranh lớn tái hiện khoảnh khắc kinh điển: Isaac Newton ngồi dưới tán cây táo. Một quả táo đang rơi, hoặc vừa chạm đất ngay trước mặt ông. Xung quanh là những chiếc lá rơi, một cuốn sách nhỏ lăn nghiêng trên thảm cỏ – những chi tiết bình dị, đời thường. Bất kỳ ai cũng có thể thấy quả táo rơi. Nếu quả táo trúng đầu, ta cảm nhận được sự đau rát. Nếu quan sát hàng ngày, ta biết mọi vật khi rơi đều hướng xuống đất. Đây là lớp nhận thức đầu tiên – nhận thức cảm tính – chỉ dừng lại ở hiện tượng trực tiếp, ở những gì giác quan đem lại.",
    audioKey: "BoiCanh1_Anh1",
  },
  BoiCanh1_Anh2: {
    title: "Câu hỏi về Bản chất",
    imageUrl: "/BoiCanh1_Anh2.png",
    description:
      "Newton ngồi trầm tư, đôi mắt ánh lên sự tò mò. Xung quanh ông, trong không gian mờ ảo, lơ lửng những công thức toán học, sơ đồ quỹ đạo hành tinh, hình ảnh Mặt Trăng tròn sáng, và các ký hiệu tượng trưng cho lực hút vô hình. Newton khẽ đưa tay chỉ vào một công thức, như thể ông vừa nắm bắt được mạch nguồn của vũ trụ.  Từ việc nhìn quả táo rơi, Newton không dừng lại ở sự “thấy”. Ông đặt câu hỏi: “Tại sao quả táo lại rơi? Có một lực nào đó kéo nó xuống chăng?”Ông liên hệ hiện tượng nhỏ bé này với chuyển động khổng lồ của Mặt Trăng quanh Trái Đất. Từ đó, qua phân tích và khái quát hóa, Newton xây dựng nên khái niệm “lực hấp dẫn” và định luật vạn vật hấp dẫn – một bước nhảy vọt của nhận thức lý tính.",
    audioKey: "BoiCanh1_Anh2",
  },
  BoiCanh1_Anh3: {
    title: "Ánh sáng của Chân lý",
    imageUrl: "/BoiCanh1_Anh3.png",
    description:
      "Không gian mở ra thành một bức tranh khổng lồ hoặc một mô hình chuyển động. Trước mắt người xem là toàn bộ hệ Mặt Trời: các hành tinh xoay quanh Mặt Trời theo những quỹ đạo chính xác, sáng lấp lánh. Xen lẫn là hình ảnh vệ tinh nhân tạo bay quanh Trái Đất, minh chứng con người đã ứng dụng quy luật ấy để chinh phục vũ trụ. Định luật vạn vật hấp dẫn không chỉ dừng lại ở trang giấy. Nó đã được kiểm chứng qua hàng ngàn quan sát thiên văn và thí nghiệm thực tế. Từ đó, con người dự đoán chính xác chuyển động thiên thể, phóng tàu vũ trụ, đặt vệ tinh, và mở rộng tầm nhìn về vũ trụ bao la.👉 Đây chính là thực tiễn kiểm nghiệm và chứng minh chân lý – nền tảng cho những thành tựu vĩ đại của khoa học và công nghệ hiện đại.",
    audioKey: "BoiCanh1_Anh3",
  },
  BoiCanh2_Anh1: {
    title: "Nỗi sợ và Cái chết",
    imageUrl: "/BoiCanh2_Anh1.png",
    description:
      "Một căn phòng tối, ánh sáng mờ ảo chỉ chiếu vào một bức tranh lớn vẽ một thành phố cổ kính trong cơn hoảng loạn. Người dân che mặt, chạy trốn. Các xác người nằm la liệt. Có thể có một đoạn âm thanh tiếng chuông tang lễ và tiếng ho sặc sụa. Bên cạnh là những câu trích dẫn: Dịch bệnh này là sự trừng phạt của thần linh!, Nó lây lan qua không khí độc!, Hãy đốt những người bệnh để diệt trừ ma quỷ! Đây là nhận thức cảm tính của con người trước một hiện tượng không thể giải thích. Họ nhìn thấy (thị giác) cái chết, nghe thấy (thính giác) tiếng rên la, và cảm nhận (cảm xúc) nỗi sợ hãi tột cùng. Những gì họ thấy và cảm nhận là những sự kiện rời rạc, bên ngoài, không đi sâu vào bản chất. Họ tin vào những lời đồn thổi, vào những giải thích thiếu căn cứ vì đó là những gì họ cảm thấy hợp lý nhất trong tình thế hoảng loạn.",
    audioKey: "BoiCanh2_Anh1",
  },
  BoiCanh2_Anh2: {
    title: "Ánh sáng của Khoa học",
    imageUrl: "/BoiCanh2_Anh2.png",
    description:
      "Một không gian sáng sủa hơn. Trưng bày các bản vẽ sơ đồ của vi khuẩn, virus, của hệ tuần hoàn máu và các tế bào miễn dịch. Các bảng biểu so sánh giữa các ca nhiễm, các nguyên nhân gây bệnh. Có thể có một mô hình 3D về cấu trúc virus. Một câu trích dẫn nổi bật: Bệnh tật không phải sự trừng phạt, nó là một phản ứng sinh học của cơ thể trước tác nhân bên ngoài. Từ những quan sát và nỗi sợ hãi ban đầu, các nhà khoa học bắt đầu tư duy, phân tích, và tìm ra bản chất của vấn đề. Họ sử dụng kính hiển vi để khám phá ra thế giới vi sinh vật (vi khuẩn, virus), xây dựng các khái niệm như mầm bệnh, lây truyền, vắc_xin. Họ hiểu được cơ chế hoạt động của bệnh dịch và tìm ra cách để phòng ngừa, chữa trị. Quá trình này hoàn toàn dựa vào tư duy trừu tượng và logic, vượt qua những cảm nhận và nỗi sợ ban đầu.",
    audioKey: "BoiCanh2_Anh2",
  },
  BoiCanh2_Anh3: {
    title: "Chiến thắng Bệnh tật",
    imageUrl: "/BoiCanh2_Anh3.png",
    description:
      "Một khu vực trưng bày thành tựu. Có hình ảnh một phòng phẫu thuật sạch sẽ, hình ảnh một ống tiêm vắc_xin đang được tiêm vào tay em bé, hình ảnh một bệnh viện hiện đại đang chữa trị cho bệnh nhân, và hình ảnh các chiến dịch tiêm chủng rộng khắp. Bên cạnh là những câu trích dẫn: Nhờ khoa học, chúng ta đã đẩy lùi được bệnh đậu mùa. hoặc Sự sống đã được cứu. Toàn bộ kiến thức lý tính về bệnh tật đã được kiểm nghiệm và áp dụng vào thực tiễn. Việc sản xuất vắc_xin và chữa trị thành công các căn bệnh đã từng là nỗi khiếp sợ là bằng chứng rõ ràng nhất cho thấy nhận thức của con người là đúng đắn. Chính nhờ thực tiễn này, những nỗi sợ hãi vô căn cứ đã dần được xóa bỏ, và nhân loại đã tiến lên",
    audioKey: "BoiCanh2_Anh3",
  },
  Center_Anh: {
    title: "Chủ nghĩa Marx–Lenin",
    imageUrl: "/Center_Anh.png",
    description: "Chủ nghĩa Marx–Lenin",
    audioKey: "Center_Anh",
  },
};

export default function Gallery({
  onPaintingClick,
  voiceState,
  voiceControls,
  currentAudioKey,
  setCurrentAudioKey,
}: {
  onPaintingClick: (paintingData: any) => void;
  voiceState?: any;
  voiceControls?: any;
  currentAudioKey?: string | null;
  setCurrentAudioKey?: (key: string | null) => void;
}) {
  const galleryRef = useRef<Mesh>(null);
  const [fallbackAudioState, fallbackAudioControls] = useVoicePlayer();

  // Use passed props or fallback to local state
  const audioState = voiceState || fallbackAudioState;
  const audioControls = voiceControls || fallbackAudioControls;
  const currentKey = currentAudioKey !== undefined ? currentAudioKey : null;
  const setCurrentKey = setCurrentAudioKey || (() => {});

  // Handle proximity-based audio for paintings in 3D space
  const handleProximityEnter = (
    paintingKey: string,
    paintingData: PaintingData
  ) => {
    // Stop current audio if different painting
    if (currentKey && currentKey !== paintingKey && audioState.isPlaying) {
      audioControls.stop();
    }

    // Load and play new audio
    const audioPath = `/audio/${paintingData.audioKey}.mp3`;
    audioControls.loadAudio(audioPath);
    setCurrentKey(paintingKey);
    setTimeout(() => {
      audioControls.play();
    }, 300);
  };

  const handleProximityExit = (paintingKey: string) => {
    // Stop audio when moving away from painting
    if (currentKey === paintingKey && audioState.isPlaying) {
      audioControls.stop();
      setCurrentKey(null);
    }
  };

  return (
    <group ref={galleryRef}>
      {/* Extended Room - 24x18 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial color="#404040" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-8, 3.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[8, 3.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Back wall (far) */}
      <mesh
        position={[0, 3.5, -9]}
        rotation={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Front wall (entrance) */}
      <mesh
        position={[0, 3.5, 9]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.05}
          emissive="#f8f8ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Center bench remains black */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.8]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Enhanced Lighting for larger room */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={30}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      <directionalLight
        position={[-3, 8, -3]}
        intensity={1.0}
        color="#f8f8ff"
        castShadow={false}
      />

      <pointLight
        position={[-6, 4.8, -2]}
        intensity={3}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[6, 4.8, -2]}
        intensity={3}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[-6, 4.8, 2]}
        intensity={3}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[6, 4.8, 2]}
        intensity={3}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[0, 4.8, 0]}
        intensity={3.5}
        color="#ffffff"
        distance={10}
        decay={0.5}
      />

      <ambientLight intensity={0.7} color="#f8f8ff" />

      {/* Left wall paintings - moved to -8 */}
      <OrnateFrame
        position={[-8, 2.5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh1_Anh1"].title}
        imageUrl={paintingDescriptions["BoiCanh1_Anh1"].imageUrl}
        size={[1.8, 1.4]}
        paintingData={paintingDescriptions["BoiCanh1_Anh1"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-8, 2.5, 5]}
        paintingKey="BoiCanh1_Anh1"
        paintingData={paintingDescriptions["BoiCanh1_Anh1"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh1_Anh1" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[-8, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh1_Anh2"].title}
        imageUrl={paintingDescriptions["BoiCanh1_Anh2"].imageUrl}
        size={[1.6, 2]}
        paintingData={paintingDescriptions["BoiCanh1_Anh2"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-8, 2.5, 0]}
        paintingKey="BoiCanh1_Anh2"
        paintingData={paintingDescriptions["BoiCanh1_Anh2"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh1_Anh2" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[-8, 2.5, -5]}
        rotation={[0, Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh1_Anh3"].title}
        imageUrl={paintingDescriptions["BoiCanh1_Anh3"].imageUrl}
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["BoiCanh1_Anh3"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-8, 2.5, -5]}
        paintingKey="BoiCanh1_Anh3"
        paintingData={paintingDescriptions["BoiCanh1_Anh3"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh1_Anh3" && audioState.isPlaying
        }
      />

      {/* Right wall paintings - moved to 8 */}
      <OrnateFrame
        position={[8, 2.5, 5]}
        rotation={[0, -Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh2_Anh1"].title}
        imageUrl={paintingDescriptions["BoiCanh2_Anh1"].imageUrl}
        size={[1.8, 1.8]}
        paintingData={paintingDescriptions["BoiCanh2_Anh1"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[8, 2.5, 5]}
        paintingKey="BoiCanh2_Anh1"
        paintingData={paintingDescriptions["BoiCanh2_Anh1"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh2_Anh1" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[8, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh2_Anh2"].title}
        imageUrl={paintingDescriptions["BoiCanh2_Anh2"].imageUrl}
        size={[1.6, 2]}
        paintingData={paintingDescriptions["BoiCanh2_Anh2"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[8, 2.5, 0]}
        paintingKey="BoiCanh2_Anh2"
        paintingData={paintingDescriptions["BoiCanh2_Anh2"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh2_Anh2" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[8, 2.5, -5]}
        rotation={[0, -Math.PI / 2, 0]}
        title={paintingDescriptions["BoiCanh2_Anh3"].title}
        imageUrl={paintingDescriptions["BoiCanh2_Anh3"].imageUrl}
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["BoiCanh2_Anh3"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[8, 2.5, -5]}
        paintingKey="BoiCanh2_Anh3"
        paintingData={paintingDescriptions["BoiCanh2_Anh3"]}
        triggerDistance={5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "BoiCanh2_Anh3" && audioState.isPlaying
        }
      />
      <OrnateFrame
        position={[0, 2.5, -8]}
        rotation={[0, 0, 0]}
        title={paintingDescriptions["Center_Anh"].title}
        imageUrl={paintingDescriptions["Center_Anh"].imageUrl}
        size={[5, 3]}
        paintingData={paintingDescriptions["Center_Anh"]}
        onPaintingClick={onPaintingClick}
      />
    </group>
  );
}
