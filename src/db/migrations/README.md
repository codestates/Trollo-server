sequelize에서 ts를 사용하기가 조금 버거워서

자체적으로 마이그레이션 파일을 구성하였습니다.

`npm run create_db` 명령어를 통해서 마이그레이션을 진행해주세요.

전반적인 그림은

1. 모델을 생성했다. (foreignKey 연결되어있다.) = association
2. 마이그레이션 파일 하나를 생성했다. 이때 sequelize.Async기능을 이용해서 db의 스키마를 구성한다.
3. 이런 과정이 ts-node 로 한줄 한줄 실행해야한다. but
4. 이런 반복적인 과정때문에 `create-table`디렉토리 내부를 순회하여서 실행문을 돌리는부분이 `migration-all-table.ts`이다.
