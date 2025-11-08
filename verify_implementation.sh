#!/bin/bash

echo "🔍 BITS Goa Campus Food - Implementation Verification"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name... "
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000${endpoint}")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_code, Got: $response_code)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test database connection
echo "📊 Testing Database Connection:"
echo "--------------------------------"
test_endpoint "Get all vendors" "/api/vendors"

# Get a vendor ID for further tests
VENDOR_ID=$(curl -s "http://localhost:5000/api/vendors" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$VENDOR_ID" ]; then
    echo -e "${GREEN}✓${NC} Retrieved vendor ID: $VENDOR_ID"
    test_endpoint "Get vendor by ID" "/api/vendors/$VENDOR_ID"
    test_endpoint "Get vendor menu" "/api/vendors/$VENDOR_ID/menu"
else
    echo -e "${RED}✗${NC} Could not retrieve vendor ID"
    ((TESTS_FAILED++))
fi

echo ""
echo "🔌 Testing Public API Endpoints:"
echo "--------------------------------"
test_endpoint "Get active vendors only" "/api/vendors?activeOnly=true"

echo ""
echo "🔒 Testing Authentication Endpoints (should require auth):"
echo "-----------------------------------------------------------"
test_endpoint "Get current user (unauthorized)" "/api/users/me" 401
test_endpoint "Create order (unauthorized)" "/api/orders" 401

echo ""
echo "📡 Testing WebSocket Server:"
echo "----------------------------"
# Check if WebSocket server is listening
if timeout 2 bash -c 'exec 3<>/dev/tcp/localhost/5000' 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} WebSocket server is accessible on port 5000"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} WebSocket server not accessible"
    ((TESTS_FAILED++))
fi

echo ""
echo "📦 Testing Database Schema:"
echo "---------------------------"
# Test that vendors have proper structure
vendor_response=$(curl -s "http://localhost:5000/api/vendors" | head -c 300)
if echo "$vendor_response" | grep -q '"name"' && echo "$vendor_response" | grep -q '"email"' && echo "$vendor_response" | grep -q '"active"'; then
    echo -e "${GREEN}✓ PASS${NC} Vendors have correct schema"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} Vendor schema incomplete"
    ((TESTS_FAILED++))
fi

# Test menu items structure
if [ -n "$VENDOR_ID" ]; then
    menu_response=$(curl -s "http://localhost:5000/api/vendors/$VENDOR_ID/menu" | head -c 300)
    if echo "$menu_response" | grep -q '"price"' && echo "$menu_response" | grep -q '"isAvailable"'; then
        echo -e "${GREEN}✓ PASS${NC} Menu items have correct schema"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} Menu item schema incomplete"
        ((TESTS_FAILED++))
    fi
fi

echo ""
echo "======================================================"
echo "📊 Test Summary:"
echo "======================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Implementation is working correctly.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review the implementation.${NC}"
    exit 1
fi
