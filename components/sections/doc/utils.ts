import { getYuqueStore, getYuqueUserRepos } from "@/api";

export async function getUserRepos() {
  return await getYuqueUserRepos("doless-pa4xy");
}

export async function getStore() {
  return await getYuqueStore("doless-pa4xy/vcboch");
}
