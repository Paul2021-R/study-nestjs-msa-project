# 섹션 6: 프로덕션 배포 
## 24. 구글 클라우드 엔진 셋업
- GCP -> Google Container Registry API 활성화 -> 당연히 유료 관련 설정 활성화 되어야 한다. 
- Artifact Registry API 도 활성화
- 저장소 에서 + 를 눌러 저장소를 추가함 - 설정안내 항목에서 어떻게 통신하는지 보여줌 
- Google Cloud SDK 가이드를 참조하여 맞는 플랫폼에 맞춰 Cloud SDK 를 연결할 것
- 연결하고 나면 명령어를 통해 gcloud 프로젝트와 연결을 수행한다
- 로그인 절차를 처리하고난 후, 빌드를 하고, 해당 빌드 이미지에 대해 레포지터리 uri 를 받아서, 이름을 추가하여 푸시 하면 이미지가 올라가게 된다. 
-

## 25. 프로덕션화 , Dockerfile refactoring
- 빌드를 각 Dockerfile 별로 할 경우 UserDocument 가 걸림(auth 영역). 해당 영역은 auth 영역 내부에 있으므로 common 에 추가하여 변경 후 빌드한다.  
- 이때 Package.json 의 의존성에서 각 마이크로 서버 별로 필요한 의존성이 다를 수 있고, 이럴 때는 내부 하위에 package.json 을 만들고, 전체 중 필요한 영역을 제외한 공통 package.json / 개별 영역의 package.json 을 만들어 활용하면 된다 