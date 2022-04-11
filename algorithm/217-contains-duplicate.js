// 存在重复元素：https://leetcode-cn.com/problems/contains-duplicate/

/**
 * @param {number[]} nums
 * @return {boolean}
 */

// 思路：哈希表

var containsDuplicate = function(nums) {
  let map = {}
  for (let i=0; i<nums.length; i++) {
    let cur = nums[i]
    if (map[cur]) {
      return true
    } else {
      map[cur] = true
    }
  }
  return false 
};