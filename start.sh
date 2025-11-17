#!/bin/bash

# 顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Score Test 本地開發環境啟動 ===${NC}\n"

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null; then
    echo -e "${RED}錯誤: Docker 未安裝${NC}"
    echo "請先安裝 Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 檢查 Docker Compose 是否安裝
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}錯誤: Docker Compose 未安裝${NC}"
    exit 1
fi

# 檢查 .env 檔案
if [ ! -f .env ]; then
    echo -e "${YELLOW}警告: .env 檔案不存在${NC}"
    if [ -f .env.example ]; then
        echo "從 .env.example 建立 .env 檔案..."
        cp .env.example .env
        echo -e "${GREEN}✓ .env 檔案已建立，請編輯並填入你的設定${NC}\n"
    else
        echo -e "${YELLOW}提示: 如需使用 Google Sheets 功能，請建立 .env 並設定相關環境變數${NC}\n"
    fi
fi

# 解析命令列參數
BUILD_FLAG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --build|-b)
            BUILD_FLAG="--build"
            shift
            ;;
        --down|-d)
            echo "停止並移除容器..."
            docker-compose down
            exit 0
            ;;
        --logs|-l)
            docker-compose logs -f
            exit 0
            ;;
        --help|-h)
            echo "使用方式:"
            echo "  ./start.sh           - 啟動開發環境"
            echo "  ./start.sh --build   - 重新建置並啟動"
            echo "  ./start.sh --down    - 停止並移除容器"
            echo "  ./start.sh --logs    - 查看容器日誌"
            exit 0
            ;;
        *)
            echo -e "${RED}未知參數: $1${NC}"
            echo "使用 --help 查看說明"
            exit 1
            ;;
    esac
done

# 啟動開發環境
echo -e "${GREEN}啟動開發環境...${NC}\n"
docker-compose up $BUILD_FLAG
