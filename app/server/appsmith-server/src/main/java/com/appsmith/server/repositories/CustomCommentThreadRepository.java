package com.appsmith.server.repositories;

import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.domains.CommentThread;
import com.mongodb.client.result.UpdateResult;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CustomCommentThreadRepository extends AppsmithRepository<CommentThread> {
    Flux<CommentThread> findByApplicationId(String applicationId, AclPermission permission);
    Mono<UpdateResult> updatePolicyUsers(String applicationId, AclPermission permission, String username);
}
